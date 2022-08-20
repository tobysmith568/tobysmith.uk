import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useMemo } from "react";
import { useSideMenu } from "../side-menu";
import NavbarAnchor from "./navbar-anchor";
import Search from "./search";

const Header: FC = () => {
  const { toggle } = useSideMenu();
  const { pathname } = useRouter();

  const mobileTitle = useMemo(() => {
    if (pathname === "/") {
      return "Toby Smith";
    }

    const urlSegments = pathname.split("/");
    return urlSegments[1];
  }, [pathname]);

  const onOpenMobileMenu = (e: SyntheticEvent) => {
    e.preventDefault();
    toggle();
  };

  return (
    <HeaderWrapper>
      <MobileMenu onClick={onOpenMobileMenu}>
        <Image src="/img/menu.svg" layout="fill" alt="Mobile menu button" />
      </MobileMenu>

      <MobileTitle>
        <h1>{mobileTitle}</h1>
      </MobileTitle>

      <MenuSide>
        <NavbarAnchor path="/" disableUnderline>
          Toby Smith
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
  cursor: pointer;
  display: none;
  height: 30px;
  width: 30px;
  left: 15px;
  padding: 0;
  position: absolute;
  top: 15px;

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
