import { describe, expect, it } from "vitest";
import { loadScript, scriptURL } from ".";

describe("loadScript", () => {
  it("loads Paddle script", async () => {
    const Paddle = await loadScript();
    expect(Paddle).toBeDefined();
    expect(Paddle.Checkout).toBeDefined();
  });

  it("resolves to Paddle on consecutive calls", async () => {
    await loadScript();
    await loadScript();
    const Paddle = await loadScript();
    expect(Paddle).toBeDefined();
  });

  it("loads Paddle script just once", async () => {
    await loadScript();
    await loadScript();
    await loadScript();
    const scripts = Array.from(document.querySelectorAll("script")).filter(
      (s) => s.src === scriptURL
    );
    expect(scripts.length).toBe(1);
  });
});
