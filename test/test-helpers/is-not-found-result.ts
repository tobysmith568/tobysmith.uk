import { GetServerSidePropsResult } from "next";

const isNotFoundResult = <T>(result: GetServerSidePropsResult<T>): result is { notFound: true } => {
  return !!(result as any).notFound;
};

export default isNotFoundResult;
