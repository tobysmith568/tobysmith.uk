import Seo from "../../src/components/seo";
import renderInHead from "../test-helpers/render-in-head";

jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    }
  };
});

describe("seo", () => {
  describe("title", () => {
    it("should set the title to 'Toby Smith' when no title is given", () => {
      renderInHead(<Seo />);

      expect(document.head).toContainHTML("<title>Toby Smith</title>");
    });

    it("should set the title to 'Toby Smith' when the title is null", () => {
      renderInHead(<Seo title={null!} />);

      expect(document.head).toContainHTML("<title>Toby Smith</title>");
    });

    it("should set the title to 'Toby Smith' when the title is an empty string", () => {
      renderInHead(<Seo title="" />);

      expect(document.head).toContainHTML("<title>Toby Smith</title>");
    });

    it("should set the title to 'Toby Smith' when the title is 'Toby Smith'", () => {
      renderInHead(<Seo title="Toby Smith" />);

      expect(document.head).toContainHTML("<title>Toby Smith</title>");
    });

    it("should set the title to 'My Title - Toby Smith' when the title is 'My Title'", () => {
      renderInHead(<Seo title="My Title" />);

      expect(document.head).toContainHTML("<title>My Title - Toby Smith</title>");
    });
  });

  describe("og:title", () => {
    it("should set the og:title to 'Toby Smith' when no title is given", () => {
      renderInHead(<Seo />);

      expect(document.head).toContainHTML(`<meta content="Toby Smith" property="og:title"/`);
    });

    it("should set the og:title to 'Toby Smith' when the title is null", () => {
      renderInHead(<Seo title={null!} />);

      expect(document.head).toContainHTML(`<meta content="Toby Smith" property="og:title" /`);
    });

    it("should set the og:title to 'Toby Smith' when the title is an empty string", () => {
      renderInHead(<Seo title="" />);

      expect(document.head).toContainHTML(`<meta content="Toby Smith" property="og:title" /`);
    });

    it("should set the og:title to 'Toby Smith' when the title is 'Toby Smith'", () => {
      renderInHead(<Seo title="Toby Smith" />);

      expect(document.head).toContainHTML(`<meta content="Toby Smith" property="og:title" /`);
    });

    it("should set the og:title to 'My Title - Toby Smith' when the title is 'My Title'", () => {
      renderInHead(<Seo title="My Title" />);

      expect(document.head).toContainHTML(
        `<meta content="My Title - Toby Smith" property="og:title" /`
      );
    });
  });

  describe("description", () => {
    it("should not set the description when no description is given", () => {
      renderInHead(<Seo />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should not set the description when the description is null", () => {
      renderInHead(<Seo description={null!} />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should not set the description when the description is an empty string", () => {
      renderInHead(<Seo description="" />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should set the description to 'My Description' when the description is 'My Description'", () => {
      renderInHead(<Seo description="My Description" />);

      expect(document.head).toContainHTML(`<meta content="My Description" name="description" /`);
    });
  });

  describe("og:description", () => {
    it("should not set the og:description when no description is given", () => {
      renderInHead(<Seo />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should not set the og:description when the description is null", () => {
      renderInHead(<Seo description={null!} />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should not set the og:description when the description is an empty string", () => {
      renderInHead(<Seo description="" />);

      expect(document.head).not.toContainHTML(`name="description"`);
    });

    it("should set the og:description to 'My Description' when the description is 'My Description'", () => {
      renderInHead(<Seo description="My Description" />);

      expect(document.head).toContainHTML(`<meta content="My Description" name="description" /`);
    });
  });

  describe("robots", () => {
    it("should set the robots meta content to index,follow when no noIndex is given", () => {
      renderInHead(<Seo />);

      expect(document.head).toContainHTML(`<meta content="index,follow" name="robots" /`);
    });

    it("should set the robots meta content to index,follow when noIndex is null", () => {
      renderInHead(<Seo noIndex={null!} />);

      expect(document.head).toContainHTML(`<meta content="index,follow" name="robots" /`);
    });

    it("should set the robots meta content to index,follow when noIndex is false", () => {
      renderInHead(<Seo noIndex={false} />);

      expect(document.head).toContainHTML(`<meta content="index,follow" name="robots" /`);
    });

    it("should set the robots meta content to noindex,follow when noIndex is true", () => {
      renderInHead(<Seo noIndex />);

      expect(document.head).toContainHTML(`<meta content="noindex,follow" name="robots" /`);
    });
  });
});
