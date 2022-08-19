import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SendEmailRequest, SendEmailResponse } from "../../pages/api/send-email";
import { postJSON } from "../../utils/http-request";
import Recaptcha from "./Recaptcha";
import RecaptchaTerms from "./recaptcha-terms";
import { useIsFormValid } from "./useIsFormValid";

type State = "unsent" | "sending" | "sent" | "error";

interface Props {
  clientKey: string;
}

const Form: FC<Props> = ({ clientKey }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formState, setFormState] = useState<State>("unsent");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValid = useIsFormValid(name, email, message);

  const isDisabled = useMemo(() => formState !== "unsent", [formState]);

  const reset = useCallback(() => {
    recaptchaRef.current?.reset();
    setFormState("unsent");
  }, [recaptchaRef]);

  const onNewToken = useCallback(
    (token: string | null) => {
      if (!token) {
        setFormState("error");
        return;
      }

      const body: SendEmailRequest = {
        name,
        email,
        message,
        recaptchaToken: token
      };

      postJSON<SendEmailRequest, SendEmailResponse>("/api/send-email", body)
        .then(() => setFormState("sent"))
        .catch(() => setFormState("error"));
    },
    [name, email, message]
  );

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormState("sending");

      recaptchaRef.current
        ?.executeAsync()
        .then(onNewToken)
        .catch(() => setFormState("error"));
    },
    [onNewToken]
  );

  return (
    <form name="contact form" autoComplete="off" onSubmit={onSubmit}>
      <label htmlFor="name">Name</label>
      <br />
      <NameInput
        type="text"
        id="name"
        name="name"
        disabled={isDisabled}
        defaultValue={name}
        onChange={e => setName(e.target.value)}
      />
      <br />

      <label htmlFor="email">Email</label>
      <br />
      <EmailInput
        type="email"
        id="email"
        name="email"
        disabled={isDisabled}
        defaultValue={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />

      <label htmlFor="message">Message</label>
      <br />
      <MessageInput
        id="message"
        name="message"
        rows={5}
        disabled={isDisabled}
        defaultValue={message}
        onChange={e => setMessage(e.target.value)}></MessageInput>
      <br />

      {(formState === "unsent" || formState === "sending") && (
        <SubmitButton
          type="submit"
          value="Send Message"
          className="submit"
          disabled={!isValid || formState === "sending"}
        />
      )}

      {formState === "sent" && <h3>Sent!</h3>}

      {formState === "error" && (
        <SubmitButton type="button" value="Error. Try Again?" onClick={reset} />
      )}

      <Recaptcha recaptchaRef={recaptchaRef} clientKey={clientKey} />
      <RecaptchaTerms />
    </form>
  );
};
export default Form;

const formInput = (props: { theme: Theme }) => css`
  font-size: 1em;
  padding: 0.2em;
  margin: 0.4em 0;
  min-width: 400px;

  @media only screen and (max-width: ${props.theme.sizes.mobileWidth}) {
    min-width: 000px;
    width: 100%;
  }
`;

const NameInput = styled.input`
  ${formInput}
  min-width: 200px;
`;

const EmailInput = styled.input`
  ${formInput}
`;

const MessageInput = styled.textarea`
  ${formInput}
`;

const SubmitButton = styled.input`
  ${formInput}
  background-color: ${({ theme }) => theme.colours.blue};
  border: ${({ theme }) => theme.colours.blue} 1px solid;
  color: ${({ theme }) => theme.colours.white};
  border-radius: 3px;

  &:disabled {
    background-color: #eeeeee;
    border: #d0d0d0 1px solid;
    color: #9e9e9e;
  }
`;
