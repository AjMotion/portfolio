import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Portfolio</h1>
      <p>Your portfolio is ready to go!</p>
    </div>
  );
}
