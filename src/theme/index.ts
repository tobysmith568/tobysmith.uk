import "@emotion/react";
import { css, SerializedStyles, Theme } from "@emotion/react";

declare module "@emotion/react" {
  export type ThemeColourName = keyof Theme;

  export interface Theme {
    colours: Colours;
    sizes: Sizes;
    underlineAnchor: (colour: keyof Colours) => SerializedStyles;
  }

  export interface Colours {
    white: string;
    black: string;

    blue: string;
    paleBlue: string;

    ownerTag: string;
    ownerTagBorder: string;

    incompleteTag: string;
    incompleteTagBorder: string;

    abandonedTag: string;
    abandonedTagBorder: string;
  }

  export interface Sizes {
    mobileWidth: string;
    tabletWidth: string;
  }
}

export const mobileWidthInPixels = 524;
export const tabletWidthInPixels = 1024;

const defaultTheme: Theme = {
  colours: {
    white: "#fff",
    black: "#000",

    blue: "dodgerblue",
    paleBlue: "aliceblue",

    ownerTag: "dodgerblue",
    ownerTagBorder: "#0077ea",

    incompleteTag: "#ff9844",
    incompleteTagBorder: "#e67f2b",

    abandonedTag: "#ff6944",
    abandonedTagBorder: "#e6502b"
  },
  sizes: {
    mobileWidth: mobileWidthInPixels + "px",
    tabletWidth: tabletWidthInPixels + "px"
  },
  underlineAnchor: colour => css`
    text-decoration: none;
    position: relative;
    color: ${colour};
    font-weight: bold;
    cursor: pointer;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.1em;
      background-color: ${colour};
      opacity: 0;
      transition: opacity 300ms, transform 300ms;
    }

    &:hover::after,
    &:focus::after {
      opacity: 1;
      transform: translate3d(0, 0.2em, 0);
    }
  `
};
export default defaultTheme;
