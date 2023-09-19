module.exports = {
  presets: ["@babel/preset-typescript"],

  env: {
    cjs: {
      presets: [
        [
          "@babel/preset-env",
          { targets: { node: "current" }, modules: "commonjs", loose: true },
        ],
      ],

      plugins: [
        [
          "@babel/plugin-transform-modules-commonjs",
          { strict: true, noInterop: true },
        ],

        ["babel-plugin-add-import-extension", { extension: "js" }],

        "babel-plugin-add-module-exports",
      ],
    },

    esm: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" }, modules: false }],
      ],

      plugins: [["babel-plugin-add-import-extension", { extension: "mjs" }]],
    },
  },

  ignore: [
    "src/**/*.d.ts",
    "src/**/tests.ts",
    "src/tests/**/*",
    "src/**/tysts.ts",
    "src/tysts/**/*",
  ],
};
