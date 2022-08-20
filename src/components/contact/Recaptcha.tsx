import { CSSProperties, FC, LegacyRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  clientKey: string;
  recaptchaRef: LegacyRef<ReCAPTCHA> | undefined;
}

const recaptchaStyle: CSSProperties = { visibility: "hidden" };

const Recaptcha: FC<Props> = ({ clientKey, recaptchaRef }) => (
  <>
    <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={clientKey} style={recaptchaStyle} />
  </>
);
export default Recaptcha;
