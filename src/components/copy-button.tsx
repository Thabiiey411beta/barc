import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  text: string;
  label: string;
  tone?: "solid" | "line";
};

export function CopyButton({ text, label, tone = "solid" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1600);
  }

  const faceLabel = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label;
  const face =
    tone === "solid"
      ? "bg-fg text-deep hover:bg-accent"
      : "border border-line bg-transparent text-fg hover:border-accent";

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-200 ${face}`}
    >
      {state === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {faceLabel}
    </button>
  );
}
