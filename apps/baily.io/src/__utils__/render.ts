import { JSXElementConstructor, ReactElement } from "react";

import { render as rtlRender } from "@testing-library/react";

/**
 * Inject mocks + necessary boilerplate setup for tests.
 */
export const render = (
  children: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  rtlRender(children);
};
