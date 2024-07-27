import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "esm",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
      plugins: [
        [
          "@babel/plugin-transform-react-jsx",
          { pragma: "h", pragmaFrag: "Fragment" },
        ],
      ],
      extensions: [".js", ".jsx"],
    }),
    terser(),
  ],
};
