import { useMemo } from "react";

export const useIsFormValid = (name: string, email: string, message: string) => {
  return useMemo(() => {
    const validName = !!name && name.length > 0;
    const validEmail = !!email && !!email.match(/^\S+@\S+\.\S+$/);
    const validMessage = !!message && message.length > 0;

    return validName && validEmail && validMessage;
  }, [name, email, message]);
};
