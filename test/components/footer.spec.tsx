import { screen } from "@testing-library/react";
import mockDate from "mockdate";
import Footer from "../../src/components/footer";
import renderWithTheme from "../test-helpers/render-with-theme";

describe("footer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockDate.reset();
  });

  afterAll(() => jest.restoreAllMocks());

  [1901, 2001, 2101].forEach(year =>
    describe(`for the year ${year}`, () => {
      // beforeEach(() => );

      it("should show a copyright with the correct year", () => {
        mockDate.set(new Date(year, 3, 27, 22, 35, 31, 123));

        renderWithTheme(<Footer />);

        expect(screen.getByText(`Copyright Toby Smith ${year}`)).toBeInTheDocument();
      });
    })
  );
});
