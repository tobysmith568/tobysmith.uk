import { screen } from "@testing-library/react";
import Home from "../../src/pages";
import renderWithTheme from "../test-helpers/render-with-theme";

jest.mock("../../src/components/seo");

describe("index", () => {
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<Home />);

  describe("Home Page", () => {
    describe("seo", () => {
      it("should set the seo title", () => {
        render();

        const seoTitle = screen.getByTestId("seo-title");

        expect(seoTitle).toHaveTextContent("Toby Smith");
      });

      it("should set the seo description", () => {
        render();

        const seoDescription = screen.getByTestId("seo-description");

        expect(seoDescription).toHaveTextContent(
          "Toby Smith is a London-based software developer who likes to focus on web-based technologies. This website is a place to see his work and read his thoughts"
        );
      });

      it("should not set the seo noIndex value", () => {
        render();

        const seoNoIndex = screen.getByTestId("seo-noindex");

        expect(seoNoIndex).toHaveTextContent("undefined");
      });
    });
  });
});
