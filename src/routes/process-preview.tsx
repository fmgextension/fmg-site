import { createFileRoute } from "@tanstack/react-router";
import { ProcessFlow } from "../components/ProcessFlow";

export const Route = createFileRoute("/process-preview")({
  component: ProcessFlowPreview,
});

function ProcessFlowPreview() {
  return (
    <div className="min-h-screen text-foreground">
      <ProcessFlow />
    </div>
  );
}
