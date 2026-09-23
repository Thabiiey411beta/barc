import { createFileRoute } from "@tanstack/react-router";
import { ArcDesk } from "@/components/arc-desk";
import { Faq, SiteFooter } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Listing } from "@/components/listing";
import { Path } from "@/components/path";
import { PackChat } from "@/components/pack-chat";
import { RaidDesk } from "@/components/raid-desk";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-deep text-fg">
      <SiteHeader />
      <main>
        <Hero />
        <Path />
        <ArcDesk />
        <RaidDesk />
        <Listing />
        <Faq />
      </main>
      <SiteFooter />
      <PackChat />
    </div>
  );
}
