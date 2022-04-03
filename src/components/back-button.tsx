import { useRouter } from "next/router";
import { FC } from "react";

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <a onClick={() => router.back()}>
      <span>⮜</span>Back
    </a>
  );
};
export default BackButton;
