"use client";

import React, { useState } from "react";
import axios from "axios";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Member = {
  id: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
};

interface EditMemberProps {
  member: Member | null; // Member object passed as a prop
  onUpdateSuccess: () => void; // Callback to refresh the members list after an update
  onCancel: () => void;
}

const EditMember: React.FC<EditMemberProps> = ({
  member,
  onUpdateSuccess,
  onCancel,
}) => {
  const [memberDetails, setMemberDetails] = useState<Member | null>(member);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberDetails) return;

    setIsLoading(true);
    try {
      await axios.patch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/members/${memberDetails.id}`,
        {
          fullName: memberDetails.fullName,
          phoneNumber: memberDetails.phoneNumber,
          password: memberDetails.password,
        }
      );

      setSuccessMessage("Member updated successfully!");
      setErrorMessage("");
      onUpdateSuccess(); // Notify parent to refresh member list
    } catch (error) {
      console.error("Error updating member:", error);
      setErrorMessage("Failed to update member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) {
    return <p className="text-gray-400">No member selected.</p>;
  }

  return (
    <div className="bg-black p-6 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Edit Member</h2>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleFormSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={memberDetails?.fullName || ""}
            onChange={(e) =>
              setMemberDetails({
                ...memberDetails!,
                fullName: e.target.value,
              })
            }
            className="w-full p-2 rounded mt-1 bg-[#222] text-white"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={memberDetails?.phoneNumber || ""}
            onChange={(e) =>
              setMemberDetails({
                ...memberDetails!,
                phoneNumber: e.target.value,
              })
            }
            className="w-full p-2 rounded mt-1 bg-[#222] text-white"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={memberDetails?.password || ""}
            onChange={(e) =>
              setMemberDetails({
                ...memberDetails!,
                password: e.target.value,
              })
            }
            className="w-full p-2 rounded mt-1 bg-[#222] text-white"
          />
        </div>
        <div className="flex space-x-5">
          {/* Submit Button */}
          <button
            type="submit"
            className="hover:bg-customBlue bg-customHoverBlue text-white px-4 py-2 rounded"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMember;
