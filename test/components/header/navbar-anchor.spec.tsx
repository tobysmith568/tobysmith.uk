import { screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";
import NavbarAnchor from "../../../src/components/header/navbar-anchor";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("next/router", () => ({
  useRouter: jest.fn()
}));

describe("navbar-anchor", () => {
  const mockUseRouter = jest.mocked(useRouter);

  let children: JSX.Element;
  let path: string;
  let disableUnderline: boolean;

  beforeEach(() => {
    children = <div data-testid="children" />;
    path = "/test";
    disableUnderline = false;

    jest.resetAllMocks();

    mockUseRouter.mockReturnValue({
      pathname: "/"
    } as NextRouter);
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(
      <NavbarAnchor path={path} disableUnderline={disableUnderline}>
        {children}
      </NavbarAnchor>
    );

  it("should link to the given path", () => {
    render();

    const anchor = screen.getByRole("link");

    expect(anchor).toHaveAttribute("href", path);
  });

  it("should have the class name 'current' if the current pathname equals the given path", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/test-path"
    } as NextRouter);
    path = "/test-path";

    render();

    const anchor = screen.getByRole("link");

    expect(anchor).toHaveClass("current");
  });

  it("should have the class 'current' if the current pathname starts with the given path", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/test-path/with/child/sections"
    } as NextRouter);
    path = "/test-path";

    render();

    const anchor = screen.getByRole("link");

    expect(anchor).toHaveClass("current");
  });

  it("should not have the class 'current' if the current pathname does not start with the given path", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/test-path"
    } as NextRouter);
    path = "/something-else";

    render();

    const anchor = screen.getByRole("link");

    expect(anchor).not.toHaveClass("current");
  });

  it("should not have the class 'current' if the current pathname does start with the given path but disableUnderline is true", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/test-path"
    } as NextRouter);
    path = "/test-path";
    disableUnderline = true;

    render();

    const anchor = screen.getByRole("link");

    expect(anchor).not.toHaveClass("current");
  });

  it("should render the children", () => {
    render();

    const children = screen.getByTestId("children");

    expect(children).toBeInTheDocument();
  });
});
