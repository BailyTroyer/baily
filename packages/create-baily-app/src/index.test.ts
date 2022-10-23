import packageJson from "../package.json";
import { createProgram } from "./index";

describe(packageJson.name, () => {
  it("does", () => {
    createProgram().parse(["", "", "fdsa"]);
  });
});
