"use client";
import { Loader2, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
interface LogOutProps {}

const LogOut: FC<LogOutProps> = ({}) => {
  const [signingOut, setSigningOut] = useState(false);
  return (
    <Button
      variant={"ghost"}
      onClick={async () => {
        setSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem signing out.");
        } finally {
          setSigningOut(false);
        }
      }}
      aria-label="Sign Out"
      title="Sign Out"
    >
      {!signingOut ? (
        <LogOutIcon className="h-4 w-4" />
      ) : (
        <Loader2 className="animate-spin h-4 w-4" />
      )}
    </Button>
  );
};

export default LogOut;
