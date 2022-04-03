import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import UnderlineLink from "../underline-link";
import Search from "./search";

const defaultMobileTitle = "Toby Smith";

const Header: FC = () => {
  const [mobileTitle, setMobileTitle] = useState(defaultMobileTitle);
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = () => {
      const path = window?.location?.pathname ?? "";
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
        <Image src="assets/img/menu.svg" alt="Mobile menu button" />
      </MobileMenu>

      <MobileTitle>
        <h1>{mobileTitle}</h1>
      </MobileTitle>

      <MenuSide>
        <UnderlineLink href="">{defaultMobileTitle}</UnderlineLink>
      </MenuSide>

      <MenuSide>
        {router.pathname.startsWith("blog") && <Search />}

        <Link href="about" passHref>
          <a>
            <span>About</span>
          </a>
        </Link>
        <Link href="projects" passHref>
          <a>
            <span>Projects</span>
          </a>
        </Link>
        <Link href="blog" passHref>
          <a>
            <span>Blog</span>
          </a>
        </Link>
        <Link href="contact" passHref>
          <a>
            <span>Contact</span>
          </a>
        </Link>
      </MenuSide>
    </HeaderWrapper>
  );
};
export default Header;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 3.5em;
  background-color: ${({ theme }) => theme.colours.blue};
  padding: 0 2em;
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
