import { screen } from "@testing-library/react";
import CmsContent from "../../src/components/cms-content";
import renderWithTheme from "../test-helpers/render-with-theme";

describe("cms-content", () => {
  it("should render the given text as plaintext when type is 'text'", () => {
    const content = "This is some text";

    renderWithTheme(<CmsContent type="text" content={content} />);

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should render the given text as plaintext when type is 'text' even if the text is valid html", () => {
    const validHtml = "<p>This is some text</p>";

    renderWithTheme(<CmsContent type="text" content={validHtml} />);

    expect(screen.getByText(validHtml)).toBeInTheDocument();
  });

  it("should render the given text as html when type is 'html'", () => {
    const innerText = "This is some text";
    const validHtmlButton = `<button>${innerText}</button>`;

    renderWithTheme(<CmsContent type="html" content={validHtmlButton} />);

    const elementsContainingHtmlButton = screen.queryAllByText(validHtmlButton);
    expect(elementsContainingHtmlButton).toHaveLength(0);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent(innerText);
  });
});
