"use client";

import Image from "next/image";
import loginImage from "./home image.png";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";
import { Link } from "@/src/i18n/routing";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface CustomJwtPayload {
  role: string;
  status: string;
}

const Login = () => {
  const t = useTranslations("login_page");
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = { phoneNumber, password };

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decodedToken = jwtDecode<CustomJwtPayload>(data.token);
        console.log("Decoded Token:", decodedToken);

        const { role, status } = decodedToken;

        if (role === "admin") {
          router.push("/en/admin");
        } else if (role === "moderator") {
          router.push("/en/attendance");
        } else if (role === "root") {
          router.push("/en/admin");
        } else if (role === "user") {
          if (status === "inactive") {
            router.push("/en/inactive-user");
          } else if (status === "pending") {
            router.push("/en/pending-user");
          } else if (status === "dormant") {
            router.push("/en/dormant-user");
          } else {
            router.push("/en/user");
          }
        }
      } else {
        setErrorMessage(data.error || "Login failed"); // Set the error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again."); // Set a generic error message
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-4/5 h-full md:relative">
        <Image
          src={loginImage}
          alt="Login Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="lg:w-3/5 w-full flex justify-center items-center bg-black">
        <div className="text-white bg-black bg-opacity-75 p-8 rounded-md">
          <h2 className="text-3xl mb-8 text-center">{t("heading")}</h2>
          <form
            className="flex flex-col items-center w-full"
            onSubmit={handleLogin}
          >
            <div className="mb-4 w-full">
              <input
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 placeholder-white/40 rounded-lg border-2 border-white/20 bg-black"
                placeholder={t("fields.phone_number")}
              />
            </div>
            <div className="mb-6 w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 placeholder-white/40 rounded-lg border-2 border-white/20 bg-black"
                placeholder={t("fields.password")}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 font-semibold text-customBlue rounded-lg bg-zinc-800 hover:bg-customBlue hover:text-black"
            >
              {t("buttons.login")}
            </button>


            <button
              type="button"
              className="w-full p-2 font-semibold text-white rounded-lg border-white border-1 hover:border-none hover:text-black hover:bg-customBlue mt-4"
            >
              <Link href="/Register"> {t("buttons.signup")} </Link>
            </button>


          </form>
          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
