const esbuild = require("esbuild");

// 调用esbuild的build方法来编译代码
esbuild
  .build({
    entryPoints: ["index.js"],
    minify: true,
    sourcemap: true,
    outfile: "dist/bundle.js",
    bundle: true,
    platform: "node",
    external: ["sharp"],
  })
  .catch(() => process.exit(1));
