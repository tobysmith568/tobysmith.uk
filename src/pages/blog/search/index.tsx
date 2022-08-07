import { GetServerSideProps } from "next";

type Props = Record<string, unknown>;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { redirect: { destination: "/blog" }, props: {} };
};

const Page = () => null;
export default Page;
