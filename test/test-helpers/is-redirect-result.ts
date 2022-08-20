import { GetServerSidePropsResult, Redirect } from "next";

type RedirectResult = { redirect: Redirect };

const isRedirectResult = <T>(result: GetServerSidePropsResult<T>): result is RedirectResult => {
  return !!(result as RedirectResult).redirect;
};

export default isRedirectResult;
