import { createFileRoute } from "@tanstack/react-router";
import { ArcDesk } from "@/components/arc-desk";
import { DenProduct } from "@/components/den-product";
import { Faq, SiteFooter } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Listing } from "@/components/listing";
import { MintDesk } from "@/components/mint-desk";
import { PackReel } from "@/components/pack-reel";
import { Path } from "@/components/path";
import { PackChat } from "@/components/pack-chat";
import { RaidDesk } from "@/components/raid-desk";
import { SiteHeader } from "@/components/site-header";
import { WalletBar } from "@/components/wallet-bar";
import { ToolDesk } from "@/components/tool-desk";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-deep text-fg">
      <SiteHeader />
      <WalletBar />
      <main>
        <Hero />
        <PackReel />
        <Path />
        <DenProduct />
        <MintDesk compact />
        <ArcDesk />
        <ToolDesk />
        <RaidDesk />
        <Listing />
        <Faq />
      </main>
      <SiteFooter />
      <PackChat />
    </div>
  );
}
