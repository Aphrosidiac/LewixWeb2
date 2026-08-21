import { AsciiMountain } from '@/components/gl/AsciiMountain';
import { AsciiDebugPanel } from '@/components/gl/AsciiDebugPanelLoader';
import { TeamModels } from '@/components/gl/TeamModels';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { PageReveal } from '@/components/layout/PageReveal';
import { Hero } from '@/components/sections/Hero';
import { ScrollStage } from '@/components/sections/ScrollStage';
import { About } from '@/components/sections/About';
import { Writing } from '@/components/sections/Writing';
import { Team } from '@/components/sections/Team';
import { Work } from '@/components/sections/Work';
// Hidden for now — the Trusted By logo band is kept in the tree, not deleted.
// Restore by uncommenting this import and the <TrustedBy /> below.
// import { TrustedBy } from '@/components/sections/TrustedBy';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      {/* Moved out of the root layout: all four are home-page-only, and mounting
          them globally made every other route wait on the mountain download. */}
      <AsciiMountain />
      <TeamModels />
      <LoadingScreen />
      <PageReveal />
      <AsciiDebugPanel />

      <Hero />
      <ScrollStage />
      <About />
      <Writing />
      <Team />
      <Work />
      {/* <TrustedBy /> */}
      <Contact />
    </main>
  );
}
