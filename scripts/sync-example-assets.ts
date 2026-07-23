import { cp, mkdir, rm } from "node:fs/promises";

const source = new URL("../public/artifacts", import.meta.url);
const publicDirectory = new URL("../examples/basic/public/", import.meta.url);
const target = new URL("artifacts", publicDirectory);

await rm(target, { force: true, recursive: true });
await mkdir(publicDirectory, { recursive: true });
await cp(source, target, { recursive: true });
