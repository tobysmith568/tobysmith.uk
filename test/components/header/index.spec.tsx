import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";
import Header from "../../../src/components/header";
import renderWithTheme from "../../test-helpers/render-with-theme";

const mockSideMenuToggle = jest.fn();
jest.mock("../../../src/components/side-menu", () => ({
  __esModule: true,
  useSideMenu: () => ({
    toggle: mockSideMenuToggle
  })
}));

jest.mock("../../../src/components/header/search", () => ({
  __esModule: true,
  default: () => <div data-testid="search" />
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn()
}));

const paths = [
  { path: "/", title: "Toby Smith" },
  { path: "/about", title: "about" },
  { path: "/projects", title: "projects" },
  { path: "/projects/project-1", title: "projects" },
  { path: "/projects/project-2", title: "projects" },
  { path: "/blog", title: "blog" },
  { path: "/blog/post-1", title: "blog" },
  { path: "/blog/post-2", title: "blog" },
  { path: "/contact", title: "contact" }
];

describe("header index", () => {
  const mockUseRouter = jest.mocked(useRouter);

  beforeEach(() => {
    jest.resetAllMocks();

    mockUseRouter.mockReturnValue({
      pathname: "/"
    } as NextRouter);
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<Header />);

  describe("mobile menu", () => {
    it("should render the mobile menu icon", () => {
      render();

      const mobileMenu = screen.getByRole("img", {
        name: /mobile menu button/i,
        hidden: true
      });

      expect(mobileMenu).toBeInTheDocument();
    });

    it("should toggle the mobile side menu when clicked", async () => {
      render();

      const mobileMenu = screen.getByRole("img", {
        name: /mobile menu button/i,
        hidden: true
      });

      await userEvent.click(mobileMenu);

      expect(mockSideMenuToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("mobile title", () => {
    paths.forEach(({ path, title }) => {
      it(`should render the mobile title '${title}' when the pathname is '${path}'`, () => {
        mockUseRouter.mockReturnValue({
          pathname: path
        } as NextRouter);

        render();

        const mobileTitle = screen.getByRole("heading", { level: 1, hidden: true });

        expect(mobileTitle).toBeInTheDocument();
        expect(mobileTitle).toHaveTextContent(title);
      });
    });
  });

  describe("menu items", () => {
    describe("Toby Smith", () => {
      it("should render the Toby Smith menu item", () => {
        render();

        const tobySmith = screen.getByRole("link", { name: /toby smith/i });

        expect(tobySmith).toBeInTheDocument();
      });

      it("should route to the index", () => {
        render();

        const tobySmith = screen.getByRole("link", { name: /toby smith/i });

        expect(tobySmith).toHaveAttribute("href", "/");
      });
    });

    describe("About", () => {
      it("should render the About menu item", () => {
        render();

        const about = screen.getByRole("link", { name: /about/i });

        expect(about).toBeInTheDocument();
      });

      it("should route to the About page", () => {
        render();

        const about = screen.getByRole("link", { name: /about/i });

        expect(about).toHaveAttribute("href", "/about");
      });
    });

    describe("Projects", () => {
      it("should render the Projects menu item", () => {
        render();

        const projects = screen.getByRole("link", { name: /projects/i });

        expect(projects).toBeInTheDocument();
      });

      it("should route to the Projects page", () => {
        render();

        const projects = screen.getByRole("link", { name: /projects/i });

        expect(projects).toHaveAttribute("href", "/projects");
      });
    });

    describe("Blog", () => {
      it("should render the Blog menu item", () => {
        render();

        const blog = screen.getByRole("link", { name: /blog/i });

        expect(blog).toBeInTheDocument();
      });

      it("should route to the Blog page", () => {
        render();

        const blog = screen.getByRole("link", { name: /blog/i });

        expect(blog).toHaveAttribute("href", "/blog");
      });
    });

    describe("Contact", () => {
      it("should render the Contact menu item", () => {
        render();

        const contact = screen.getByRole("link", { name: /contact/i });

        expect(contact).toBeInTheDocument();
      });

      it("should route to the Contact page", () => {
        render();

        const contact = screen.getByRole("link", { name: /contact/i });

        expect(contact).toHaveAttribute("href", "/contact");
      });
    });
  });

  describe("search", () => {
    it("should render the search bar when the pathname starts with '/blog", () => {
      mockUseRouter.mockReturnValue({
        pathname: "/blog"
      } as NextRouter);

      render();

      const search = screen.getByTestId("search");

      expect(search).toBeInTheDocument();
    });

    it("should not render the search bar when the pathname does not start with '/blog", () => {
      mockUseRouter.mockReturnValue({
        pathname: "/blob"
      } as NextRouter);

      render();

      const search = screen.queryByTestId("search");

      expect(search).not.toBeInTheDocument();
    });
  });
});
