import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="w-full flex flex-col gap-3 justify-center items-center">
      <Skeleton className="h-[3rem] w-10 mb-8" />
      <Skeleton count={2} className="h-[1rem] w-8" />
    </div>
  );
};

export default loading;
