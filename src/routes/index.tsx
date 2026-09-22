import { createFileRoute } from "@tanstack/react-router";
import { Faq, SiteFooter } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Listing } from "@/components/listing";
import { Path } from "@/components/path";
import { RaidDesk } from "@/components/raid-desk";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-deep text-fg">
      <SiteHeader />
      <main>
        <Hero />
        <RaidDesk />
        <Path />
        <Listing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
