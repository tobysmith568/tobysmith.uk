import "@emotion/react";
import { css, SerializedStyles, Theme } from "@emotion/react";

declare module "@emotion/react" {
  export type ThemeColourName = keyof Theme;

  export interface Theme {
    colours: Colours;
    sizes: Sizes;
    underline: Underline;
  }

  export interface Colours {
    white: string;
    black: string;

    blue: string;
    paleBlue: string;

    tags: TagColours;
  }

  export type Tags = "owner" | "incomplete" | "abandoned";

  export type TagColours = Record<
    Tags,
    {
      background: string;
      border: string;
    }
  >;

  export interface Sizes {
    mobileWidth: string;
    tabletWidth: string;

    contact: {
      externalsBreak1: string;
      externalsBreak2: string;
    };
  }

  export interface Underline {
    hoverTarget: (colour?: keyof Colours) => SerializedStyles;
    after: (colour?: keyof Colours) => SerializedStyles;
    afterOnHover: () => SerializedStyles;
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

    tags: {
      owner: {
        background: "dodgerblue",
        border: "#0077ea"
      },
      incomplete: {
        background: "#ff9844",
        border: "#e67f2b"
      },
      abandoned: {
        background: "#ff6944",
        border: "#e6502b"
      }
    }
  },
  sizes: {
    mobileWidth: mobileWidthInPixels + "px",
    tabletWidth: tabletWidthInPixels + "px",

    contact: {
      externalsBreak1: "1285px",
      externalsBreak2: "1000px"
    }
  },

  underline: {
    hoverTarget: colour => css`
      text-decoration: none;
      position: relative;
      color: ${colour ?? "black"};
      font-weight: bold;
      cursor: pointer;
    `,
    after: colour => css`
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${colour ?? "black"};
      opacity: 0;
      transition: opacity 300ms, transform 300ms;
    `,
    afterOnHover: () => css`
      opacity: 1;
      transform: translate3d(0, 2px, 0);
    `
  }
};
export default defaultTheme;
