import { Theme, ThemeProvider } from "@emotion/react";
import { render } from "@testing-library/react";
import defaultTheme from "../../src/theme";

const renderWithTheme = (component: JSX.Element, theme?: Theme) =>
  render(<ThemeProvider theme={theme ?? defaultTheme}>{component}</ThemeProvider>);
export default renderWithTheme;
