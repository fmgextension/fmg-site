import { createFileRoute } from "@tanstack/react-router";
import { ResultsScatter } from "@/components/ResultsScatter";

export const Route = createFileRoute("/results-preview")({
  component: ResultsScatterPreview,
});

function ResultsScatterPreview() {
  return (
    <div className="min-h-screen text-foreground">
      <ResultsScatter />
    </div>
  );
}
