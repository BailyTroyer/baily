import { screen } from "@testing-library/react";

import { render } from "../__utils__/render";
import Home from "../pages/index";

describe("Index", () => {
  it("renders a heading", () => {
    render(<Home />);

    expect(screen.getByText(/Hey, I'm Baily 👋/)).toBeInTheDocument();
  });
});
