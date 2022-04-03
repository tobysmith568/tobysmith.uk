import styled from "@emotion/styled";
import { FC } from "react";

const year = new Date().getFullYear().toString();

const Footer: FC = () => (
  <FooterWrapper>
    <p>Copyright Toby Smith {year}</p>
  </FooterWrapper>
);
export default Footer;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  padding: 1em;
`;
