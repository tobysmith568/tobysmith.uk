import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import NavbarAnchor from "./navbar-anchor";
import Search from "./search";

const defaultMobileTitle = "Toby Smith";

const Header: FC = () => {
  const [mobileTitle, setMobileTitle] = useState(defaultMobileTitle);

  const { events, pathname } = useRouter();

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

    events.on("routeChangeComplete", onRouteChange);

    return () => {
      events.off("routeChangeComplete", onRouteChange);
    };
  }, [events]);

  return (
    <HeaderWrapper>
      <MobileMenu>
        <Image src="/img/menu.svg" layout="fill" alt="Mobile menu button" />
      </MobileMenu>

      <MobileTitle>
        <h1>{mobileTitle}</h1>
      </MobileTitle>

      <MenuSide>
        <NavbarAnchor path="/" disableUnderline>
          {defaultMobileTitle}
        </NavbarAnchor>
      </MenuSide>

      <MenuSide>
        {pathname.startsWith("/blog") && <Search />}

        <NavbarAnchor path="/about">About</NavbarAnchor>
        <NavbarAnchor path="/projects">Projects</NavbarAnchor>
        <NavbarAnchor path="/blog">Blog</NavbarAnchor>
        <NavbarAnchor path="/contact">Contact</NavbarAnchor>
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

const MobileMenu = styled.a`
  display: none;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    display: block;
  }

  img {
    height: 30px;
  }
`;

const MobileTitle = styled.div`
  align-items: stretch;
  height: 100%;
  display: none;
  flex-direction: row;
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
  display: flex;
  height: 100%;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    display: none;
  }
`;
