import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { FC } from "react";
import SideMenu, { useSideMenu } from "../../src/components/side-menu";
import renderWithThemeAndNoState from "../test-helpers/render-with-theme-and-no-state";

const TestToggleButtons: FC = () => {
  const { toggle } = useSideMenu();

  return (
    <>
      <button onClick={() => toggle()}>Toggle SideMenu</button>
      <button onClick={() => toggle(true)}>Open SideMenu</button>
      <button onClick={() => toggle(false)}>Close SideMenu</button>
    </>
  );
};

const renderWithTestButtons = () =>
  renderWithThemeAndNoState(
    <>
      <TestToggleButtons />
      <SideMenu />
    </>
  );

const clickToggleTestButton = () => {
  const toggleButton = screen.getByRole("button", { name: "Toggle SideMenu" });
  act(() => toggleButton.click());
};

const clickOpenTestButton = () => {
  const openButton = screen.getByRole("button", { name: "Open SideMenu" });
  act(() => openButton.click());
};

const clickCloseTestButton = () => {
  const closeButton = screen.getByRole("button", { name: "Close SideMenu" });
  act(() => closeButton.click());
};

describe("side-menu", () => {
  describe("open/closed", () => {
    it("should not be open by default", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");

      expect(sideNav).not.toHaveClass("open");
    });

    it("should be open when the side-menu is toggled", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickToggleTestButton();

      expect(sideNav).toHaveClass("open");
    });

    it("should be closed when the side-menu is toggled twice", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickToggleTestButton();
      clickToggleTestButton();

      expect(sideNav).not.toHaveClass("open");
    });

    it("should be open when the side-menu is opened", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickOpenTestButton();

      expect(sideNav).toHaveClass("open");
    });

    it("should remain open when the side-menu is opened while already open", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickOpenTestButton();
      expect(sideNav).toHaveClass("open");

      clickOpenTestButton();
      expect(sideNav).toHaveClass("open");
    });

    it("should be closed when the side-menu is closed", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickOpenTestButton();
      expect(sideNav).toHaveClass("open");

      clickCloseTestButton();
      expect(sideNav).not.toHaveClass("open");
    });

    it("should remain closed when the side-menu is closed while already closed", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickCloseTestButton();
      expect(sideNav).not.toHaveClass("open");
    });

    it("should close when the overlay is clicked", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      clickOpenTestButton();
      expect(sideNav).toHaveClass("open");

      const overlay = screen.getByRole("presentation");
      act(() => overlay.click());

      expect(sideNav).not.toHaveClass("open");
    });

    it("should remain closed when the overlay is clicked when the side-menu is closed", () => {
      renderWithTestButtons();

      const sideNav = screen.getByRole("navigation");
      expect(sideNav).not.toHaveClass("open");

      const overlay = screen.getByRole("presentation");
      act(() => overlay.click());

      expect(sideNav).not.toHaveClass("open");
    });
  });

  describe("links", () => {
    it("should route to the index when the home link is clicked", () => {
      renderWithTestButtons();

      const aboutLink = screen.getByRole("link", { name: "Home" });

      expect(aboutLink).toHaveAttribute("href", "/");
    });

    it("should route to the about page when the about link is clicked", () => {
      renderWithTestButtons();

      const aboutLink = screen.getByRole("link", { name: "About" });

      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should route to the projects page when the projects link is clicked", () => {
      renderWithTestButtons();

      const aboutLink = screen.getByRole("link", { name: "Projects" });

      expect(aboutLink).toHaveAttribute("href", "/projects");
    });

    it("should route to the blog page when the blog link is clicked", () => {
      renderWithTestButtons();

      const aboutLink = screen.getByRole("link", { name: "Blog" });

      expect(aboutLink).toHaveAttribute("href", "/blog");
    });

    it("should route to the contact page when the contact link is clicked", () => {
      renderWithTestButtons();

      const aboutLink = screen.getByRole("link", { name: "Contact" });

      expect(aboutLink).toHaveAttribute("href", "/contact");
    });
  });
});
