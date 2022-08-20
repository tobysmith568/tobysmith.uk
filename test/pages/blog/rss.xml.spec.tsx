jest.mock("../../../src/pages/blog/rss", () => ({
  __esModule: true,
  default: "RSS",
  getServerSideProps: "getServerSideProps"
}));

describe("rss.xml", () => {
  it("should default export Rss from rss path", () => {
    jest.isolateModules(() => {
      const result = require("../../../src/pages/blog/rss.xml").default;

      expect(result).toBe("RSS");
    });
  });

  it("should export getServerSideProps from rss path", () => {
    jest.isolateModules(() => {
      const result = require("../../../src/pages/blog/rss.xml").getServerSideProps;

      expect(result).toBe("getServerSideProps");
    });
  });
});

// eslint-disable-next-line jest/no-export
export {};
