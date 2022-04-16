import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import ExternalContactLink from "../components/contact/external-contact-link";
import Form from "../components/contact/form";
import Seo from "../components/seo";
import { Contact, getEnv } from "../utils/api-only/env";

interface Props {
  contact: Contact;
  clientKey: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { contact, recaptcha } = getEnv();

  return {
    props: {
      contact,
      clientKey: recaptcha.clientKey
    }
  };
};

const AboutPage: NextPage<Props> = ({ contact, clientKey }) => {
  return (
    <>
      <Seo
        title="Contact Me"
        description="Get in contact with Toby using one of these methods including email, and LinkedIn"
      />

      <main>
        <Title>Contact Me</Title>
        <p>Feel free to reach out me to via any of the methods below</p>

        <Container>
          <Externals>
            <ExternalContactLink
              isEmail
              href={contact.email}
              img="/img/email.svg"
              imgAlt="Email icon"
              name="Email"
              username={contact.email}
            />
            <ExternalContactLink
              newTab
              href={contact.githubUrl}
              img="/img/github.svg"
              imgAlt="GitHub icon"
              name="GitHub"
              username={contact.githubUsername}
            />
            <ExternalContactLink
              newTab
              href={contact.linkedinUrl}
              img="/img/linkedin.svg"
              imgAlt="LinkedIn icon"
              name="LinkedIn"
              username={contact.linkedinUsername}
            />
            <ExternalContactLink
              newTab
              href={contact.facebookUrl}
              img="/img/facebook.svg"
              imgAlt="Facebook icon"
              name="Facebook"
              username={contact.facebookUsername}
            />
          </Externals>

          <ContactForm>
            <ContactFormTitle>Message Form</ContactFormTitle>

            <Form clientKey={clientKey} />
          </ContactForm>
        </Container>
      </main>
    </>
  );
};
export default AboutPage;

const Title = styled.h1`
  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak1}) {
    flex-direction: row-reverse;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak2}) {
    flex-direction: column;
  }
`;

const Externals = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 2em;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak1}) {
    flex-direction: column;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak2}) {
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 0.5em;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    grid-template-columns: 100%;
    margin-top: 0;
  }
`;

const ContactForm = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak1}) {
    justify-content: stretch;
  }
`;

const ContactFormTitle = styled.h2`
  margin-top: 5em;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak1}) {
    margin-top: 1em;
  }
`;
