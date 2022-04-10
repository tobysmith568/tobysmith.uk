import { Colours } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  colour: keyof Colours;
}

const UnderlineAnchor = styled.a<Props>`
  ${({ theme, colour }) => theme.underlineAnchor(colour)};
`;
export default UnderlineAnchor;
