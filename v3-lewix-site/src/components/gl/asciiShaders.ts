// Fullscreen-quad vertex shader shared by the trail pass and the ascii pass.
export const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Mesh material matching dragonfly.xyz's lighting model. The important part is
// `+ 0.5` with a clamp floor of 0.15: the surface is never allowed to go dark,
// so the glyph ramp always has a full tonal range to map onto. `normal *
// uNormalStrength` adds per-face variation, which is what produces the dense
// speckled texture rather than flat blocks of one character.
export const meshVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const meshFragment = /* glsl */ `
  uniform vec3 uRemapColor;
  uniform vec3 uLightDir;
  uniform float uFlatShading;
  uniform float uBrightness;
  uniform float uNormalStrength;
  uniform float uReveal;   // 1.0 = hidden, 0.0 = fully visible

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    vec3 normal = normalize(mix(vNormal, flatNormal, uFlatShading));

    vec3 lightDir = normalize(uLightDir);
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 color = (diff * uBrightness) + normal * uNormalStrength + 0.5;
    color = clamp(color, 0.15, 0.995);
    color *= uRemapColor;

    // Normal-based reveal: upward-facing surfaces appear first.
    float edge = 0.05;
    float revealMask = dot(normal, vec3(0.0, 1.0, 0.0));
    revealMask = revealMask * 0.5 + 0.5;

    float visible = step(uReveal, revealMask);
    float edgeBand = smoothstep(uReveal - edge, uReveal, revealMask)
                   - smoothstep(uReveal, uReveal + edge, revealMask);

    vec3 edgeColor = vec3(0.5, 0.8, 0.2);
    color = mix(color, edgeColor, edgeBand);

    gl_FragColor = vec4(color, visible);
  }
`;

// Cursor trail: 40 recent pointer positions drawn as pixelated fading circles.
export const trailFragment = /* glsl */ `
  #define TRAIL_LENGTH 40
  #define PIXEL_SIZE 80.0

  uniform vec2 uTrail[TRAIL_LENGTH];
  uniform float uTrailStrength[TRAIL_LENGTH];
  uniform float uVelocity;

  varying vec2 vUv;

  vec2 pixelate(vec2 uv, float pixels) {
    return floor(uv * pixels) / pixels;
  }

  float circle(vec2 uv, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - 0.02, radius + 0.02, length(uv - center));
  }

  void main() {
    vec2 uv = pixelate(vUv, PIXEL_SIZE);

    vec3 color = vec3(0.0);
    float trail = 0.0;

    for (int i = 0; i < TRAIL_LENGTH; i++) {
      float size = uVelocity * 0.025 * (1.0 - float(i) / float(TRAIL_LENGTH));
      float strength = uTrailStrength[i] * (1.0 - float(i) / float(TRAIL_LENGTH));
      trail += circle(uv, uTrail[i], size) * strength;
    }

    trail = clamp(trail, 0.0, 1.0);
    color = mix(vec3(0.0), vec3(1.0), trail);

    gl_FragColor = vec4(color, trail * uVelocity);
  }
`;

// The ascii pass, ported from dragonfly.xyz: pixelate into a grid, map cell
// luminance to a glyph index, sample the 16x16 atlas, and tint edges that the
// cursor trail crosses with the accent colour.
export const asciiFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform sampler2D tMouseTrail;
  uniform sampler2D uCharactersTexture;

  uniform vec2 uResolution;

  uniform float uGranularity;
  uniform float uCharactersLimit;
  uniform float uOutProgress;
  uniform float uOpacity;
  uniform float uSmear;
  uniform float uBrightness;
  uniform bool uNoise;
  uniform bool uMatrix;

  /**
   * 0 = nothing drawn, 1 = every glyph present.
   * Each grid cell gets its own threshold, weighted by screen height so the
   * range builds from the base upward, plus a per-cell hash so the leading edge
   * is ragged instead of a clean horizontal line.
   */
  uniform float uBuild;

  /**
   * Widens each cell's sample. The pass normally takes ONE tap at the cell
   * centre, so geometry thinner than a cell — a katana blade, a dragon's tail —
   * weaves between centres as it turns and breaks into dashes. Sampling a few
   * points per cell and keeping the most-covered one makes thin features
   * continuous. 0 disables it.
   */
  uniform float uDilate;

  uniform bool uFillPixels;
  uniform bool uOverwriteColor;
  uniform bool uGreyscale;
  uniform bool uInvert;

  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform vec3 uBackground;

  uniform float uTime;

  varying vec2 vUv;

  vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
    return blend * opacity + base * (1.0 - opacity);
  }

  float grayscale(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  float random(float x) {
    return fract(sin(x) * 123456.789);
  }

  float noise2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  void main() {
    vec2 screenUV = vUv;

    // Stable pixelation grid
    vec2 division = uResolution / uGranularity;
    vec2 d = 1.0 / division;
    vec2 pixelizedUV = d * (floor(screenUV / d) + 0.5);

    vec4 mouseTrail = texture2D(tMouseTrail, screenUV);

    // -------------------------
    // BUILD-UP
    // -------------------------
    // Materialise the range one glyph cell at a time. Cells low on screen come
    // in first; the hash scatters neighbours so the front edge dissolves in
    // rather than sweeping as a straight line.
    if (uBuild < 1.0) {
      vec2 cellId = floor(screenUV / d);
      float cellRand = noise2D(cellId * 0.137);
      float order = mix(pixelizedUV.y, cellRand, 0.45);
      if (order > uBuild) discard;
    }

    // Matrix column motion
    if (uMatrix) {
      float noise = random(pixelizedUV.x);
      pixelizedUV.y += uTime * abs(noise);
      pixelizedUV.y = fract(pixelizedUV.y);
    }

    // Exit lift
    float columnNoise = random(floor(pixelizedUV.x * division.x));
    float exitLift = uOutProgress * (1.2 + columnNoise);

    // Smear / waterfall
    float waterfallAlpha = 1.0;

    if (uSmear > 0.0) {
      float rowHeight = d.y;
      float py = clamp(pixelizedUV.y, 0.0, 1.0);

      float rowIndex = floor(py / rowHeight);
      float totalRows = division.y;

      float rowNoise = hash(rowIndex * 17.0);
      float edgeNoise = hash(rowIndex * 21.0);
      float stretchNoise = hash(rowIndex * 9.0 + 0.3);

      float smearRows = uSmear * totalRows;

      float noiseAmount = 0.35 * uSmear;
      float noisySmearRows = smearRows + (rowNoise - 0.5) * noiseAmount * totalRows;

      float blendRows = max(1.0, smearRows * 0.835);
      float dist = noisySmearRows - rowIndex;
      float smearMask = clamp(dist / blendRows, 0.0, 1.0);

      smearMask = pow(smearMask, mix(1.5, 3.0, edgeNoise));

      float lastRowY = rowHeight * 0.5;

      float flowNoise = hash(rowIndex * 31.0 + pixelizedUV.x * 13.0);
      py -= flowNoise * rowHeight * smearMask * 0.6;
      py = mix(py, lastRowY, smearMask);

      float depth = 1.0 - (rowIndex / totalRows);

      float stretch = 0.1;
      stretch *= uSmear;
      stretch *= stretch;
      stretch *= mix(0.6, 1.4, stretchNoise);

      float cx = 0.5;
      pixelizedUV.x = cx + (pixelizedUV.x - cx) * (1.0 + stretch * smearMask);
      pixelizedUV.y = py;

      waterfallAlpha = mix(1.0, 0.05, depth * smearMask * uSmear);
    }

    pixelizedUV.y -= exitLift;

    if (pixelizedUV.y < 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 finalUV = pixelizedUV;

    vec4 pixelizedColor = texture2D(tDiffuse, finalUV);

    if (uDilate > 0.0) {
      vec2 o = d * 0.5 * uDilate;
      vec4 s1 = texture2D(tDiffuse, finalUV + vec2(o.x, 0.0));
      vec4 s2 = texture2D(tDiffuse, finalUV - vec2(o.x, 0.0));
      vec4 s3 = texture2D(tDiffuse, finalUV + vec2(0.0, o.y));
      vec4 s4 = texture2D(tDiffuse, finalUV - vec2(0.0, o.y));
      if (s1.a > pixelizedColor.a) pixelizedColor = s1;
      if (s2.a > pixelizedColor.a) pixelizedColor = s2;
      if (s3.a > pixelizedColor.a) pixelizedColor = s3;
      if (s4.a > pixelizedColor.a) pixelizedColor = s4;
    }
    float grayColor = grayscale(pixelizedColor.rgb);

    if (uInvert) {
      grayColor = 1.0 - grayColor;
    }

    // Edge detection on tDiffuse
    vec2 texel = 1.0 / uResolution;

    float left  = grayscale(texture2D(tDiffuse, finalUV + vec2(-texel.x, 0.0)).rgb);
    float right = grayscale(texture2D(tDiffuse, finalUV + vec2( texel.x, 0.0)).rgb);
    float up    = grayscale(texture2D(tDiffuse, finalUV + vec2(0.0,  texel.y)).rgb);
    float down  = grayscale(texture2D(tDiffuse, finalUV + vec2(0.0, -texel.y)).rgb);

    float edgeX = right - left;
    float edgeY = up - down;
    float edgeMask = length(vec2(edgeX, edgeY));
    edgeMask = smoothstep(0.01, 0.25, edgeMask);

    // Glyph selection from the 16x16 atlas
    vec2 size = vec2(16.0);

    float baseCharIndex = floor(grayColor * (uCharactersLimit - 1.0));
    float trailCharIndex = floor(mouseTrail.r * (uCharactersLimit - 1.0));

    float trailInfluence = step(0.1, mouseTrail.r) * edgeMask;
    float charIndex = mix(baseCharIndex, trailCharIndex, trailInfluence);

    float charX = mod(charIndex, size.x);
    float charY = floor(charIndex / size.y);

    vec2 charUV = mod(screenUV * (division / size), 1.0 / size);
    charUV -= vec2(0.0, 1.0 / size);
    charUV += vec2(charX, -charY) / size;

    vec4 ascii = texture2D(uCharactersTexture, charUV);

    // Noise
    float asciiNoise = 1.0;

    if (uNoise) {
      float n = noise2D(pixelizedUV * 120.0 + uTime * 0.0001);
      asciiNoise = smoothstep(0.5, 0.9, n);
      asciiNoise = mix(0.6, 1.4, asciiNoise);
    }

    ascii.r *= asciiNoise;

    vec4 color = ascii;

    if (uFillPixels) {
      if (uOverwriteColor) {
        color.rgb = uColor * ceil(pixelizedColor.rgb);
        if (uGreyscale) {
          color.rgb *= grayscale(pixelizedColor.rgb);
        }
      } else if (uGreyscale) {
        color.rgb = vec3(grayscale(pixelizedColor.rgb));
      } else {
        color.rgb = pixelizedColor.rgb;
      }

      color.rgb += ascii.r;
      color.a = pixelizedColor.a;

    } else if (uOverwriteColor) {
      color.rgb = uColor * ascii.r;
      color.a = pixelizedColor.a;

      if (uGreyscale) {
        color.rgb *= grayscale(pixelizedColor.rgb);
      }

    } else if (uGreyscale) {
      color.rgb = vec3(grayscale(pixelizedColor.rgb)) * ascii.r;

    } else {
      color = pixelizedColor * ascii.r;
    }

    if (color.rgb == vec3(0.0)) {
      color.a = 0.0;
    }

    float alpha = (uBackground == vec3(0.0)) ? color.a : 1.0;
    alpha *= waterfallAlpha;
    alpha *= uOpacity;

    vec3 finalColor = blendNormal(uBackground, color.rgb, color.a);

    // Accent colour on edges the cursor trail crosses
    float trailMask = mouseTrail.r * ascii.r * edgeMask;
    finalColor = mix(finalColor, uAccentColor, trailMask);

    finalColor += vec3(uBrightness);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Mesh shader for the team models.
 *
 * Differs from the hero's in one respect: it samples the model's NORMAL MAP.
 * These assets are low-poly shells — the brain is only ~4.8k triangles — and
 * carry all their surface relief (gyri, sulci, scale and engraving detail) in a
 * normal texture. Lighting from vertex normals alone gives a smooth blob whose
 * interior barely changes as it turns, because those normals vary slowly and
 * almost linearly across the surface.
 */
export const detailMeshVertex = /* glsl */ `
  attribute vec4 tangent;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;

    vNormal = normalize(normalMatrix * normal);

    // Geometry without a TANGENT attribute binds tangent to zero, and
    // normalize(vec3(0)) is undefined — that NaN can poison the varying on some
    // drivers even though the branch that reads it is skipped. Fall back to an
    // arbitrary perpendicular instead.
    vec3 t = tangent.xyz;
    if (dot(t, t) < 1e-8) {
      t = abs(normal.y) < 0.99 ? cross(normal, vec3(0.0, 1.0, 0.0)) : vec3(1.0, 0.0, 0.0);
    }
    vTangent = normalize(normalMatrix * t);
    // tangent.w carries bitangent handedness; default to +1 when absent.
    float handed = tangent.w == 0.0 ? 1.0 : tangent.w;
    vBitangent = normalize(cross(vNormal, vTangent) * handed);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const detailMeshFragment = /* glsl */ `
  uniform sampler2D uNormalMap;
  uniform bool uHasNormalMap;
  uniform float uNormalMapScale;

  uniform vec3 uRemapColor;
  uniform vec3 uLightDir;
  uniform float uFlatShading;
  uniform float uBrightness;
  uniform float uNormalStrength;
  uniform float uReveal;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vPosition;

  void main() {
    vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    vec3 normal = normalize(mix(vNormal, flatNormal, uFlatShading));

    if (uHasNormalMap) {
      vec3 T = normalize(vTangent);
      vec3 B = normalize(vBitangent);
      vec3 mapN = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
      mapN.xy *= uNormalMapScale;
      normal = normalize(mat3(T, B, normal) * mapN);
    }

    vec3 lightDir = normalize(uLightDir);
    float diff = max(dot(normal, lightDir), 0.0);

    // Same tonal contract as the hero: a floor of 0.15 and a +0.5 base keep
    // every lit cell inside the glyph ramp instead of collapsing to blanks.
    vec3 color = (diff * uBrightness) + normal * uNormalStrength + 0.5;
    color = clamp(color, 0.15, 0.995);
    color *= uRemapColor;

    float revealMask = dot(normal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
    float visible = step(uReveal, revealMask);

    gl_FragColor = vec4(color, visible);
  }
`;
