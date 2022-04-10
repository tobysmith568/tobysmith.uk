import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import Footer from "../components/footer";
import Header from "../components/header";
import SideMenu from "../components/side-menu";
import "../styles/globals.css";
import theme, { mobileWidthInPixels, tabletWidthInPixels } from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Header />
        <NextNProgress />
        <SideMenu />
        <Page>
          <Content>
            <Component {...pageProps} />
          </Content>
          <Footer />
        </Page>
      </Layout>
    </ThemeProvider>
  );
}
export default MyApp;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

const Page = styled.div`
  position: absolute;
  top: 3.5em;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 3.5em);
  padding-top: 2em;
  overflow-y: scroll;
`;

/**
 * https://stackoverflow.com/a/62033317/3075190
 */
const createWidthLerp = (
  smallBreakpoint: number,
  largeBreakpoint: number,
  widthPercentAtSmallBreakpoint: number,
  widthPercentAtLargeBreakpoint: number
): string => {
  const x1 = smallBreakpoint;
  const y1 = x1 * widthPercentAtSmallBreakpoint;

  const x2 = largeBreakpoint;
  const y2 = x2 * widthPercentAtLargeBreakpoint;

  const m = (y2 - y1) / (x2 - x1);
  const b = y1 - m * x1;

  return `calc(${m * 100}% + ${b}px)`;
};

const contentWidthLerp = createWidthLerp(mobileWidthInPixels, tabletWidthInPixels, 0.9, 0.7);

const Content = styled.div`
  flex-grow: 1;
  max-width: min(1000px, 90%);
  width: ${contentWidthLerp};
`;
