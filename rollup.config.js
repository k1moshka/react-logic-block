const esbuild = require("rollup-plugin-esbuild").default;
const dts = require("rollup-plugin-dts").default;

const config = [
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.js",
      format: "esm"
    },
    plugins: [esbuild()],
    external: ["lodash", "react", "logic-block"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.d.ts",
      format: "es"
    },
    plugins: [dts()],
  }
];

module.exports = config;