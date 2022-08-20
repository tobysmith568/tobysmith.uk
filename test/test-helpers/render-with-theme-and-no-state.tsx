import { Theme, ThemeProvider } from "@emotion/react";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import defaultTheme from "../../src/theme";

const renderWithThemeAndNoState = (component: JSX.Element, theme?: Theme) =>
  render(
    <ThemeProvider theme={theme ?? defaultTheme}>
      <JotaiProvider>{component}</JotaiProvider>
    </ThemeProvider>
  );
export default renderWithThemeAndNoState;
