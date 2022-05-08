import { GetServerSidePropsResult, Redirect } from "next";

const isRedirectResult = <T>(
  result: GetServerSidePropsResult<T>
): result is { redirect: Redirect } => {
  return !!(result as any).redirect;
};

export default isRedirectResult;
