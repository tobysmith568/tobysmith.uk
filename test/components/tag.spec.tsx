import { screen } from "@testing-library/react";
import Tag from "../../src/components/tag";
import renderWithTheme from "../test-helpers/render-with-theme";

describe("tag", () => {
  let label: string;
  let url: string;
  let iconUrl: string | undefined;

  beforeEach(() => {
    label = "label text";
    url = "https://example.com";
    iconUrl = undefined;
  });

  const render = () => renderWithTheme(<Tag label={label} url={url} iconUrl={iconUrl} />);

  it("should render the given label text", () => {
    render();

    const anchorTag = screen.getByRole("link", { name: label });

    expect(anchorTag).toBeInTheDocument();
  });

  describe("rel", () => {
    it("should have a rel of 'noopener noreferrer' if the url starts with http", () => {
      url = "http://example.com";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have a rel of 'noopener noreferrer' if the url starts with mailto", () => {
      url = "mailto:test@user.com";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have no rel if the url is a path beginning with a slash", () => {
      url = "/blog/something";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).not.toHaveAttribute("rel");
    });

    it("should have no rel if the url is a relative path without a slash prefix", () => {
      url = "blog/something";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).not.toHaveAttribute("rel");
    });
  });

  describe("target", () => {
    it("should have a target of '_blank' if the url starts with http", () => {
      url = "http://example.com";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).toHaveAttribute("target", "_blank");
    });

    it("should have a target of '_blank' if the url starts with mailto", () => {
      url = "mailto:test:user.com";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).toHaveAttribute("target", "_blank");
    });

    it("should have no target if the url is a path beginning with a slash", () => {
      url = "/blog/something";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).not.toHaveAttribute("target");
    });

    it("should have no target if the url is a relative path without a slash prefix", () => {
      url = "blog/something";

      render();

      const anchorTag = screen.getByRole("link", { name: label });

      expect(anchorTag).not.toHaveAttribute("target");
    });
  });

  describe("icon", () => {
    it("should render an icon if the iconUrl is defined", () => {
      iconUrl = "https://example.com/icon.svg";

      render();

      const icon = screen.getByRole("img");

      expect(icon).toBeInTheDocument();
    });

    it("should not render an icon if the iconUrl is undefined", () => {
      iconUrl = undefined;

      render();

      const icon = screen.queryByRole("img");

      expect(icon).not.toBeInTheDocument();
    });
  });
});
