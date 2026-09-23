import { createFileRoute } from "@tanstack/react-router";
import { DenWorkspace } from "@/components/den-workspace";

export const Route = createFileRoute("/den/aurora")({ component: () => <DenWorkspace room="Aurora" /> });