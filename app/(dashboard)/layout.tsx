import { authOptions } from "@/lib/auth";
import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Icons } from "@/components/Icons";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notFound = () => {};

  const session = await getServerSession(authOptions);

  if (!session) notFound();

  return (
    <section className="w-full flex h-screen ">
      <div className="flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-8">
        <Link href="/Dashboard">
          <Icons.Logo className="h-8 w-auto text-indigo-600 " />
        </Link>
      </div>

      {children}
    </section>
  );
}
