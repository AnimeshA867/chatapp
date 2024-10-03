import { chatHrefConstructor, cn } from "@/lib/utils";
import { FC, ButtonHTMLAttributes } from "react";
import toast, { type Toast } from "react-hot-toast";
import Image from "next/image";
import { X } from "lucide-react";

interface UnseenChatToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  senderMessage: string;
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({
  t,
  senderId,
  sessionId,
  senderImage,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex right-1 ring-black ring-opacity-5 ease-linear duration-300",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        onClick={() => {
          toast.dismiss(t.id);
        }}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="flex-1 w-0 p-4 "
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImage}
                alt={senderName}
              />
            </div>
          </div>

          <div className="ml-3 flex-1 ">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="text-sm mt-1 text-gray-500">{senderMessage}</p>
          </div>
        </div>
      </a>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default UnseenChatToast;
