import { GetServerSidePropsResult } from "next";

type NotFoundResult = { notFound: true };

const isNotFoundResult = <T>(result: GetServerSidePropsResult<T>): result is NotFoundResult => {
  return !!(result as NotFoundResult).notFound;
};

export default isNotFoundResult;
