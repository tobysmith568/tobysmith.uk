import "@emotion/react";
import { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export type ThemeColourName = keyof Theme;

  export interface Theme {
    colours: Colours;
    sizes: Sizes;
  }

  export interface Colours {
    white: string;
    black: string;
    blue: string;
    paleBlue: string;
  }

  export interface Sizes {
    mobileWidth: string;
    tabletWidth: string;
  }
}

const defaultTheme: Theme = {
  colours: {
    white: "#fff",
    black: "#000",
    blue: "dodgerblue",
    paleBlue: "aliceblue"
  },
  sizes: {
    mobileWidth: "524px",
    tabletWidth: "1024px"
  }
};
export default defaultTheme;
