"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const userId = params?.id;
  const token = params?.token;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const verifyUser = async () => {
    if (!userId || !token) return;
    setStatus("loading");
    try {
      const baseUrl = window.location.origin; // ensure absolute URL
      const result = await axios.post(`${baseUrl}/api/user/verify`, {
        userId,
        verifySecret: token,
      });

      if (result.status === 200) {
        setStatus("success");
        setMessage("✅ Verified! You can leave this page.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.error || "❌ Verification failed");
    }
  };

  useEffect(() => {
    verifyUser();
  }, [userId, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        {status === "loading" && <p className="text-blue-500 font-semibold mb-4">Verifying...</p>}
        {message && <p className="text-lg font-medium mb-4">{message}</p>}
        <h2 className="text-2xl font-bold mb-6">Verify Account for {userId}</h2>
        {status !== "success" && (
          <button
            onClick={verifyUser}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry Verification
          </button>
        )}
      </div>
    </div>
  );
}
