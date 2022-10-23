import { Command } from "commander";

import packageJson from "../package.json";

export const createProgram = () =>
  new Command(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.description)
    .option("-c, --chill")
    .option("-f, --fuck-you", "description goes here")
    .description("description here")
    .addHelpCommand("after", "some after help command")
    .argument("<directory>")
    .action((str, options) => {
      const userAgent = process.env.npm_config_user_agent;
      console.log("user agent", userAgent?.split("/")[0]);
      console.log("YO: ", str, options);
    })
    .allowUnknownOption();

// Error handle if project path missing

if (process.env.NODE_ENV !== "test") {
  createProgram().parse();
}
