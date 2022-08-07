import { GetServerSideProps } from "next";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { redirect: { destination: "/blog" }, props: null! };
};

const Page = () => null;
export default Page;
