import { screen } from "@testing-library/react";
import FormattedDate from "../../src/components/formatted-date";
import renderWithTheme from "../test-helpers/render-with-theme";

describe("formatted-date", () => {
  const dateInputs = ["2022-04-27", "2022/04/27", "Thursday 27 April 2022", "27 April 2022"];

  dateInputs.forEach(dateInput => {
    it(`should correctly format the date: ${dateInput}`, () => {
      renderWithTheme(<FormattedDate dateValue={dateInput} />);

      expect(screen.getByText(/27 Apr 2022/i)).toBeInTheDocument();
    });
  });
});
