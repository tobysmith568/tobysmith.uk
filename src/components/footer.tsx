import styled from "@emotion/styled";
import { FC, useMemo } from "react";

const Footer: FC = () => {
  const year = useMemo(() => new Date().getFullYear().toString(), []);

  return (
    <FooterWrapper>
      <p>Copyright Toby Smith {year}</p>
    </FooterWrapper>
  );
};
export default Footer;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  padding: 1em;
`;
