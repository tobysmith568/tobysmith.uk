import { render } from "@testing-library/react";
import Page, { getServerSideProps } from "../../../../src/pages/blog/search";

describe("blog search", () => {
  describe("getServerSideProps", () => {
    it("should always return a redirect to /blog", async () => {
      const result = await getServerSideProps(null!);

      expect(result).toHaveProperty("redirect.destination", "/blog");
    });

    it("should always return no props", async () => {
      const result = await getServerSideProps(null!);

      expect(result).toHaveProperty("props", {});
    });
  });

  describe("Page", () => {
    it("should always render null", () => {
      const { container } = render(<Page />);
      expect(container.innerHTML).toHaveLength(0);
    });
  });
});
