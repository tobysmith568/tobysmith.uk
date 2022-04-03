import { Colours } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  colour: keyof Colours;
}

const UnderlineAnchor = styled.a<Props>`
  text-decoration: none;
  position: relative;
  color: ${({ theme, colour }) => theme.colours[colour]};
  font-weight: bold;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.1em;
    background-color: ${({ theme, colour }) => theme.colours[colour]};
    opacity: 0;
    transition: opacity 300ms, transform 300ms;
  }

  &:hover::after,
  &:focus::after {
    opacity: 1;
    transform: translate3d(0, 0.2em, 0);
  }
`;
export default UnderlineAnchor;
