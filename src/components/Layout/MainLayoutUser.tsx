import ChatSection from "@/features/user/ChatSection";
import Footer from "@/features/user/Footer";
import Navbar from "@/features/user/Navbar";
import useUser from "@/hooks/CRUD/useUser";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const MainLayoutUser = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  const router = useRouter();

  const { user, isLoading, getUser } = useUser();

  useEffect(() => {
    if (role !== null) {
      getUser();
    }
  }, [role, token]);

  return (
    <>
      <Navbar user={user!} />
      <div className="min-h-[80vh] bg-primaryBg pb-16">{children}</div>
      {!router.asPath.includes("chat") && !role?.toLocaleLowerCase().includes("admin") && (
        <ChatSection user={user!} token={token} role={role!} />
      )}
      <Footer />
    </>
  );
};

export default MainLayoutUser;
