"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import LoadingPage from "./loading";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface CustomJwtPayload {
  role: string;
  status: string;
  id: string; // Add userId to the payload
}
const DashboardContent = lazy(
  () => import("./components/UserDashBoardContent")
);

const UserDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const { role, status, id } = decodedToken;

      if (role === "root") {
        setUserId(id); // Set userId here
      } else if (role !== "user" || status !== "active") {
        router.push("/");
      } else {
        setUserId(id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/");
    }
  }, [router]);

  if (isLoading) return <LoadingPage />;

  return (
    <Suspense>
      <DashboardContent userId={userId} status={status} />
    </Suspense>
  );
};

export default UserDashboard;
