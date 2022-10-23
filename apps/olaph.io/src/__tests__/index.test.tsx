import { screen } from "@testing-library/react";

import { render } from "../__utils__/render";
import Index from "../pages";

describe("Index", () => {
  it("renders a heading", () => {
    render(<Index />);

    expect(screen.getByText(/Olaph/)).toBeInTheDocument();
  });
});
