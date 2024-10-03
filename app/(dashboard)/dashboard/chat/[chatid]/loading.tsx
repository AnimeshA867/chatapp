import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface loadingProps {}

const LoadingSkeleton: FC<loadingProps> = () => {
  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      {/* Chat Header Skeleton */}
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <Skeleton circle={true} height={48} width={48} className="ml-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <Skeleton height={20} width={150} />
            <Skeleton height={15} width={200} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Message List Skeleton with alternating messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 15 }).map((_, index) => {
          // Alternating message alignment: right for index 0, 3, left for others
          const isRightAligned = index % 3 === 0; // Every 3rd message is on the right

          return (
            <div
              key={index}
              className={`flex ${
                isRightAligned ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start space-x-4">
                {!isRightAligned && (
                  <Skeleton circle={true} height={40} width={40} />
                )}
                <div className="flex flex-col space-y-2">
                  <Skeleton height={20} width={200} />
                  <Skeleton height={15} width={250} />
                </div>
                {isRightAligned && (
                  <Skeleton circle={true} height={40} width={40} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Skeleton */}
      <div className="border-t border-gray-200 px-4 pt-2 pb-2">
        <Skeleton height={40} />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
