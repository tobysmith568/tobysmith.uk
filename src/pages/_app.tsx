import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import type { AppProps } from "next/app";
import Footer from "../components/footer";
import Header from "../components/header";
import SideMenu from "../components/side-menu";
import "../styles/globals.css";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Header />
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
  padding-top: 3.5em;
  overflow-y: scroll;
`;

const Content = styled.div`
  flex-grow: 1;
`;
