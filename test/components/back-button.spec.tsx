import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackButton from "../../src/components/back-button";
import renderWithTheme from "../test-helpers/render-with-theme";

const mockedRouterBack = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    back: mockedRouterBack
  })
}));

describe("back-button", () => {
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  it("should render anchor with the word 'Back'", () => {
    renderWithTheme(<BackButton />);

    const anchor = screen.getByText(/back/i);

    expect(anchor).toBeInTheDocument();
  });

  it("should navigate back when the anchor is clicked", async () => {
    expect(mockedRouterBack).toHaveBeenCalledTimes(0);

    renderWithTheme(<BackButton />);

    const anchor = screen.getByText(/back/i);

    await userEvent.click(anchor);

    expect(mockedRouterBack).toHaveBeenCalledTimes(1);
  });
});
