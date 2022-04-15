import styled from "@emotion/styled";

const RecaptchaTerms = () => (
  <Wrapper>
    <span>
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
        {" "}
        Privacy Policy{" "}
      </a>
      and
      <a href="https://policies.google.com/terms" rel="noopener noreferrer" target="_blank">
        {" "}
        Terms of Service apply{" "}
      </a>
      .
    </span>
  </Wrapper>
);
export default RecaptchaTerms;

const Wrapper = styled.div`
  font-size: 0.7em;
  max-width: 400px;

  a {
    color: ${({ theme }) => theme.colours.blue};
  }
`;
