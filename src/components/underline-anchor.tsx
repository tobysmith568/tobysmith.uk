import { Colours } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  colour?: keyof Colours;
}

const UnderlineAnchor = styled.a<Props>`
  ${({ theme, colour }) => theme.underline.hoverTarget(colour ?? "black")};

  ::after {
    ${({ theme, colour }) => theme.underline.after(colour ?? "black")};
  }

  &:hover::after,
  &:focus::after {
    ${({ theme }) => theme.underline.afterOnHover()};
  }
`;
export default UnderlineAnchor;
