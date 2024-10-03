import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold mb-4">Recents Chats</h1>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative bg-zinc-50 border-zinc-200 p-3 rounded-md mb-4"
        >
          <div className="absolute right-4 inset-y-0 flex items-center">
            <Skeleton circle height={28} width={28} />
          </div>
          <div className="relative sm:flex">
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              <Skeleton circle height={24} width={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                <Skeleton width={150} />
              </h4>
              <p className="mt-1 max-w-md">
                <Skeleton width={250} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default loading;
