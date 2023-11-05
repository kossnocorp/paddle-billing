import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/tests.web.ts"],

    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
    },
  },
});
