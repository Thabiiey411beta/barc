import { createFileRoute } from "@tanstack/react-router";
import { LicensePage } from "@/components/den-workspace";

export const Route = createFileRoute("/den/license/$tokenId")({ component: LicenseRoute });

function LicenseRoute() {
  const { tokenId } = Route.useParams();
  return <LicensePage tokenId={tokenId} />;
}