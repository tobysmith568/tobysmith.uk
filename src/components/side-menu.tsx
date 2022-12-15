import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { FC, useCallback } from "react";
import UnderlineAnchor from "./underline-anchor";

const isOpenAtom = atom<boolean>(false);

export const useSideMenu = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const toggle = useCallback(
    (optionalState?: boolean) => {
      if (optionalState !== undefined) {
        setIsOpen(optionalState);
        return;
      }

      setIsOpen(currentState => !currentState);
    },
    [setIsOpen]
  );

  return { isOpen, toggle };
};

const SideMenu: FC = () => {
  const { isOpen, toggle } = useSideMenu();

  const overlayClick = useCallback(() => {
    toggle(false);
  }, [toggle]);

  return (
    <SideMenuWrapper className={isOpen ? "open" : ""}>
      <Overlay className="overlay" onClick={overlayClick} role="presentation" />
      <Menu className="menu">
        <MenuItem>
          <Link href="/" passHref legacyBehavior>
            <UnderlineAnchor colour="white" tabIndex={-1} onClick={overlayClick}>
              Home
            </UnderlineAnchor>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/about" passHref legacyBehavior>
            <UnderlineAnchor colour="white" tabIndex={-1} onClick={overlayClick}>
              About
            </UnderlineAnchor>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/projects" passHref legacyBehavior>
            <UnderlineAnchor colour="white" tabIndex={-1} onClick={overlayClick}>
              Projects
            </UnderlineAnchor>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/blog" passHref legacyBehavior>
            <UnderlineAnchor colour="white" tabIndex={-1} onClick={overlayClick}>
              Blog
            </UnderlineAnchor>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/contact" passHref legacyBehavior>
            <UnderlineAnchor colour="white" tabIndex={-1} onClick={overlayClick}>
              Contact
            </UnderlineAnchor>
          </Link>
        </MenuItem>
      </Menu>
    </SideMenuWrapper>
  );
};
export default SideMenu;

const transition = "0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)";

const SideMenuWrapper = styled.nav`
  height: 100%;
  width: 100%;

  &.open {
    .overlay {
      @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
        background-color: #0000009e;
        pointer-events: all;
      }
    }

    .menu {
      @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
        left: -10%;
      }
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #00000000;
  transition: background-color ${transition};
  z-index: 10;
  pointer-events: none;
`;

const Menu = styled.div`
  position: fixed;
  height: 100%;
  width: 80%;
  padding-left: 15%;
  background-color: ${({ theme }) => theme.colours.blue};
  left: -80%;
  transition: left ${transition};
  z-index: 10;
`;

const MenuItem = styled.div`
  margin-top: 2em;

  a {
    color: ${({ theme }) => theme.colours.white};
    font-size: 1.4em;
    font-weight: normal;

    &::after {
      background-color: ${({ theme }) => theme.colours.white};
    }
  }
`;
