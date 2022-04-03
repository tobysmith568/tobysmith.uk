import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import UnderlineAnchor from "../underline-anchor";
import Search from "./search";

const defaultMobileTitle = "Toby Smith";

const Header: FC = () => {
  const [mobileTitle, setMobileTitle] = useState(defaultMobileTitle);
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = () => {
      const path = window?.location?.pathname ?? "/";
      const urlSegments = path.split("/");

      if (urlSegments.length < 2 || urlSegments[1] === "") {
        setMobileTitle(defaultMobileTitle);
        return;
      }

      setMobileTitle(urlSegments[1]);
    };

    router.events.on("routeChangeComplete", onRouteChange);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);

  return (
    <HeaderWrapper>
      <MobileMenu>
        <Image src="/assets/img/menu.svg" layout="fill" alt="Mobile menu button" />
      </MobileMenu>

      <MobileTitle>
        <h1>{mobileTitle}</h1>
      </MobileTitle>

      <MenuSide>
        <Link href="/" passHref>
          <NavbarAnchor colour="white">{defaultMobileTitle}</NavbarAnchor>
        </Link>
      </MenuSide>

      <MenuSide>
        {router.pathname.startsWith("/blog") && <Search />}

        <Link href="/about" passHref>
          <NavbarAnchor colour="white">About</NavbarAnchor>
        </Link>

        <Link href="/projects" passHref>
          <NavbarAnchor colour="white">Projects</NavbarAnchor>
        </Link>

        <Link href="/blog" passHref>
          <NavbarAnchor colour="white">Blog</NavbarAnchor>
        </Link>

        <Link href="/contact" passHref>
          <NavbarAnchor colour="white">Contact</NavbarAnchor>
        </Link>
      </MenuSide>
    </HeaderWrapper>
  );
};
export default Header;

const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 3.5em;
  padding: 0 2em;
  background-color: ${({ theme }) => theme.colours.blue};
  color: ${({ theme }) => theme.colours.white};

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    justify-content: center;
  }
`;

const Menu = css`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

const MobileMenu = styled.a`
  ${Menu}

  display: none;
  position: absolute;
  height: 30px;
  top: 15px;
  left: 15px;
  cursor: pointer;
  padding: 0;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    display: flex;
  }

  img {
    height: 30px;
  }
`;

const MobileTitle = styled.div`
  ${Menu}

  display: none;
  text-transform: capitalize;

  h1 {
    font-size: 1.3em;
    font-weight: normal;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    display: flex;
  }
`;

const MenuSide = styled.div`
  ${Menu}

  display: flex;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    display: none;
  }
`;

const NavbarAnchor = styled(UnderlineAnchor)`
  padding: 0em 1em;
  display: grid;
  justify-content: center;
  align-content: center;
  font-weight: normal;
`;
