import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";
import Search from "../../../src/components/header/search";
import renderWithThemeAndNoState from "../../test-helpers/render-with-theme-and-no-state";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn()
}));

describe("search", () => {
  const mockedRouterPush = jest.fn();
  const mockedRouterOn = jest.fn<undefined, [string, (path: string) => void]>();
  const mockedRouterOff = jest.fn();

  beforeEach(jest.resetAllMocks);
  afterAll(jest.restoreAllMocks);

  beforeEach(() => {
    jest.mocked(useRouter).mockImplementation(
      () =>
        ({
          push: mockedRouterPush,
          events: {
            on: mockedRouterOn,
            off: mockedRouterOff
          }
        } as any as NextRouter)
    );
  });

  const render = () => renderWithThemeAndNoState(<Search />);

  it("should contain a typed search query", async () => {
    const query = "search-term";

    render();

    const searchBox = screen.getByRole("searchbox");

    await userEvent.type(searchBox, query);

    expect(searchBox).toHaveValue(query);
  });

  it("should route to search results when enter is pressed", async () => {
    const query = "search-term";
    const expectedUrl = "/blog/search/search-term";

    render();

    const searchBox = screen.getByRole("searchbox");

    await userEvent.type(searchBox, query + "{enter}");

    expect(mockedRouterPush).toHaveBeenCalledTimes(1);
    expect(mockedRouterPush).toHaveBeenCalledWith(expectedUrl);
  });

  it("should url encode the search term", async () => {
    const query = "search with spaces";
    const expectedUrl = "/blog/search/search%20with%20spaces";

    render();

    const searchBox = screen.getByRole("searchbox");

    await userEvent.type(searchBox, query + "{enter}");

    expect(mockedRouterPush).toHaveBeenCalledTimes(1);
    expect(mockedRouterPush).toHaveBeenCalledWith(expectedUrl);
  });

  it("should subscribe to route changes on mount", async () => {
    render();

    expect(mockedRouterOn).toHaveBeenCalledTimes(1);
    expect(mockedRouterOn).toHaveBeenCalledWith("routeChangeComplete", expect.any(Function));
  });

  it("should clear the search term on route change to a non-search result page", async () => {
    const nonSearchPage = "/about";

    render();

    const searchBox = screen.getByRole("searchbox");

    await userEvent.type(searchBox, "search term");

    expect(searchBox).not.toHaveValue("");

    act(() => {
      const subscribedRouteEventCallback = mockedRouterOn.mock.calls[0][1];
      subscribedRouteEventCallback(nonSearchPage);
    });

    expect(searchBox).toHaveValue("");
  });

  it("should unsubscribe to route changes on unmount", async () => {
    const { unmount } = render();

    const subscribedRouteEventCallback = mockedRouterOn.mock.calls[0][1];

    expect(mockedRouterOff).not.toHaveBeenCalled();

    unmount();

    expect(mockedRouterOff).toHaveBeenCalledTimes(1);
    expect(mockedRouterOff).toHaveBeenCalledWith("routeChangeComplete", subscribedRouteEventCallback);
  });
});
