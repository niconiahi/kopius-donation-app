import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") return;
  const { worker } = await import("~/mocks/browser");
  console.info("Starting MSW service worker…");
  await worker.start();
}

enableMocking().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
});
