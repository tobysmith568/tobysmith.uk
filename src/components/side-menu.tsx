import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";
import { FC, useCallback } from "react";
import UnderlineLink from "./underline-link";

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
    <SideMenuWrapper isOpen={isOpen}>
      <Overlay onClick={overlayClick}></Overlay>
      <Menu>
        <MenuItem>
          <UnderlineLink href="/" tabIndex={-1} onClick={overlayClick}>
            Home
          </UnderlineLink>
        </MenuItem>
        <MenuItem>
          <UnderlineLink href="about" tabIndex={-1} onClick={overlayClick}>
            About
          </UnderlineLink>
        </MenuItem>
        <MenuItem>
          <UnderlineLink href="projects" tabIndex={-1} onClick={overlayClick}>
            Projects
          </UnderlineLink>
        </MenuItem>
        <MenuItem>
          <UnderlineLink href="blog" tabIndex={-1} onClick={overlayClick}>
            Blog
          </UnderlineLink>
        </MenuItem>
        <MenuItem>
          <UnderlineLink href="contact" tabIndex={-1} onClick={overlayClick}>
            Contact
          </UnderlineLink>
        </MenuItem>
      </Menu>
    </SideMenuWrapper>
  );
};
export default SideMenu;

const transition = "0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)";

interface SideMenuWrapperProps {
  isOpen: boolean;
}

const SideMenuWrapper = styled.div<SideMenuWrapperProps>`
  height: 100%;
  width: 100%;

  &.open {
    .overlay {
      @media only screen and (max-width: $mobileWidth) {
        background-color: #0000009e;
        pointer-events: all;
      }
    }

    .menu {
      @media only screen and (max-width: $mobileWidth) {
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
    color: $white;
    font-size: 1.4em;
    font-weight: normal;

    &::after {
      background-color: $white;
    }
  }
`;
