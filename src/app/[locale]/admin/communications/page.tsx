"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AdminBroadcastsAndAdverts = () => {
  const [broadcastName, setBroadcastName] = useState("");
  const [broadcastDescription, setBroadcastDescription] = useState("");
  const [advertName, setAdvertName] = useState("");
  const [advertDescription, setAdvertDescription] = useState("");
  const [advertSlug, setAdvertSlug] = useState("");
  const [advertPhoto, setAdvertPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [broadcastStatus, setBroadCastStatus] = useState<
    "success" | "error" | null
  >(null);
  const [broadcastErrorMessage, setBroadcastErrorMessage] = useState<
    string | null
  >("");
  const [advertisementErrorMessage, setAdvertisementErrorMessage] = useState<
    string | null
  >("");
  const [advertStatus, setAdvertStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleBroadcastSubmit = async () => {
    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_API_BASE_URL}/api/broadcast/add`,
        {
          name: broadcastName,
          description: broadcastDescription,
        }
      );
      if (response.status === 201) {
        setBroadCastStatus("success");
        // setTimeout(() => setBroadCastStatus(null), 3000);
        setBroadcastName("");
        setBroadcastDescription("");
      }
    } catch (error) {
      setBroadCastStatus("error");

      // Check if the error is an AxiosError or has the expected properties
      let errorMessage = "Failed to send broadcast.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setBroadcastErrorMessage(errorMessage);
      // alert(`Error: ${errorMessage}`);
      setTimeout(() => {
        setBroadCastStatus(null);
        setBroadcastErrorMessage("");
      }, 3000);
    }
  };

  const handleAdvertSubmit = async () => {
    // Validate required fields
    if (!advertName.trim() || !advertSlug.trim() || !advertDescription.trim()) {
      setAdvertStatus("error");
      setAdvertisementErrorMessage("Error: All fields are required.");
      setTimeout(() => {
        setAdvertStatus(null);
        setAdvertisementErrorMessage("");
      }, 3000);
      return;
    }

    if (!(advertPhoto instanceof File)) {
      setAdvertStatus("error");
      setAdvertisementErrorMessage("Error: Please upload a valid image file.");
      setTimeout(() => {
        setAdvertStatus(null);
        setAdvertisementErrorMessage("");
      }, 3000);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("name", advertName);
    formData.append("slug", advertSlug);
    formData.append("description", advertDescription);
    formData.append("image", advertPhoto);

    try {
      const response = await axios.put(
        `${NEXT_PUBLIC_API_BASE_URL}/api/advertisement/edit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setAdvertStatus("success");
        setTimeout(() => setAdvertStatus(null), 3000);

        // Clear form fields
        setAdvertName("");
        setAdvertDescription("");
        setAdvertSlug("");
        setAdvertPhoto(null);
        setPreview(null);
      }
    } catch (error) {
      setAdvertStatus("error");

      // Type-check error safely
      let errorMessage = "Failed to edit advert.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAdvertisementErrorMessage(errorMessage);

      setTimeout(() => {
        setAdvertStatus(null);
        setAdvertisementErrorMessage("");
      }, 3000);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAdvertPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-3 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Broadcast Section */}
        <div className="flex-1 bg-black md:p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4"> Broadcast</h2>
          <div>
            <label className="block text-sm font-light mb-2">Name</label>
            <input
              type="text"
              value={broadcastName}
              onChange={(e) => setBroadcastName(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[0.5px] focus:ring-customBlue"
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2">Description</label>
            <textarea
              value={broadcastDescription}
              onChange={(e) => setBroadcastDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[0.5px] focus:ring-customBlue"
            ></textarea>
          </div>
          <button
            onClick={handleBroadcastSubmit}
            className="bg-customBlue hover:bg-customHoverBlue px-6 py-2 rounded text-white font-semibold"
          >
            Send Broadcast
          </button>
          {broadcastStatus === "success" && (
            <p className="text-green-400 mt-4">Broadcast sent successfully!</p>
          )}
          {broadcastStatus === "error" && (
            <p className="text-red-400 mt-4">{broadcastErrorMessage}</p>
          )}
        </div>

        {/* Advert Section */}
        <div className="flex-1 bg-black md:p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4"> Advert</h2>
          <div>
            <label className="block text-sm font-light mb-2">Name</label>
            <input
              type="text"
              value={advertName}
              onChange={(e) => setAdvertName(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[0.5px] focus:ring-customBlue"
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2">Description</label>
            <textarea
              value={advertDescription}
              onChange={(e) => setAdvertDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[0.5px] focus:ring-customBlue"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-light mb-2">
              One word identifier (Must be unique!)
            </label>
            <textarea
              value={advertSlug}
              onChange={(e) => setAdvertSlug(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-[0.5px] focus:ring-customBlue"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-light mb-2">Photo</label>
            <input
              type="file"
              onChange={handlePhotoChange}
              className="w-full text-gray-400"
            />
          </div>
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
              <Image
                src={preview}
                alt="Advert Preview"
                width={50}
                height={50}
                className="w-full max-h-64 object-cover border border-gray-700 rounded-lg"
              />
            </div>
          )}
          <button
            onClick={handleAdvertSubmit}
            className="bg-customBlue hover:bg-customHoverBlue px-6 py-2 rounded text-white font-semibold"
          >
            Add Advert
          </button>
          {advertStatus === "success" && (
            <p className="text-green-400 mt-4">Advert added successfully!</p>
          )}
          {advertStatus === "error" && (
            <p className="text-red-400 mt-4">{advertisementErrorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBroadcastsAndAdverts;
