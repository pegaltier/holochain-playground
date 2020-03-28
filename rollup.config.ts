import { createDefaultConfig } from "@open-wc/building-rollup";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

const config = createDefaultConfig({
  input: "./index.html"
});

export default {
  ...config,
  external: [],
  plugins: [
    ...config.plugins,
    typescript(),
    resolve({preferBuiltins: false}),
    commonjs(),
    sourcemaps()
  ]
};
