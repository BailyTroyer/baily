// src/index.ts
import { Command } from "commander";

// package.json
var package_default = {
  name: "create-baily-app",
  version: "0.1.0",
  description: "Create a web app the baily way",
  type: "module",
  main: "index.js",
  exports: "./dist/index.js",
  bin: {
    "create-baily-app": "./dist/index.js"
  },
  scripts: {
    tsc: "tsc",
    build: "tsup",
    dev: "tsup --watch",
    test: "jest",
    clean: "rm -rf dist .turbo node_modules",
    start: "node dist/index.js"
  },
  dependencies: {
    commander: "^9.4.1"
  },
  devDependencies: {
    "@swc/core": "^1.3.8",
    "@swc/jest": "^0.2.23",
    "@types/jest": "^29.1.2",
    "@types/node": "^18.8.5",
    jest: "^29.2.0",
    tsup: "^6.2.3",
    typescript: "^4.8.4"
  }
};

// src/index.ts
var createProgram = () => new Command(package_default.name).version(package_default.version).description(package_default.description).option("-c, --chill").option("-f, --fuck-you", "description goes here").description("description here").addHelpCommand("after", "some after help command").argument("<directory>").action((str, options) => {
  const userAgent = process.env.npm_config_user_agent;
  console.log("user agent", userAgent?.split("/")[0]);
  console.log("YO: ", str, options);
}).allowUnknownOption();
if (process.env.NODE_ENV !== "test") {
  createProgram().parse();
}
export {
  createProgram
};
//# sourceMappingURL=index.js.map