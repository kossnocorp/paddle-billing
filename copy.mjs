import { copyFile, mkdir } from "fs/promises";
import chokidar from "chokidar";
import { dirname, join } from "path";

const watch = !!process.argv.find((arg) => arg === "--watch");

chokidar
  .watch(["src", "package.json", "*.md"], { persistent: watch })
  .on("all", async (event, srcPath) => {
    if (filesRegExp.test(srcPath) && (event === "change" || event === "add")) {
      const libPath = srcRegExp.test(srcPath)
        ? srcPath.replace(/^src/, "lib")
        : join("lib", srcPath);
      const dir = dirname(libPath);
      await mkdir(dir, { recursive: true });
      await copyFile(srcPath, libPath);
      console.log(`Copied ${srcPath} to ${libPath}`);
    }
  });

const filesRegExp = /\.(d\.ts|json|md)$/;
const srcRegExp = /^src\//;
