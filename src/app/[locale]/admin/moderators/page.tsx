"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import EditMember from "./components/EditProfile"; // Import the EditMember component

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Member = {
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  role: string;
};

const ModeratorsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch members
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_API_BASE_URL}/api/members`
      );
      const users = response.data.data.users;

      // Filter out members with the role 'root'
      const filteredUsers = users.filter(
        (user: { role: string }) =>
          user.role === "admin" || user.role === "attendance"
      );

      setMemberList(filteredUsers);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching members:", error);
      setErrorMessage("Failed to load members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="bg-black p-6 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Moderators List</h2>

      {isLoading && <p className="text-gray-400">Loading...</p>}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      {/* Table Layout */}
      <div className="mt-10 overflow-auto">
        <table className="min-w-[800px] w-full">
          <thead>
            <tr>
              <th className="px-2 text-left text-gray-200 font-bold text-sm py-3">
                Name
              </th>
              <th className="px-2 text-left text-gray-200 font-bold text-sm py-3">
                Phone Number
              </th>
              <th className="px-2 text-left text-gray-200 font-bold text-sm py-3">
                Created At
              </th>
              <th className="px-2 text-left text-gray-200 font-bold text-sm py-3">
                Role{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => (
              <tr
                key={member.id}
                className={`${index % 2 === 0 ? "bg-[#ffffff12]" : "bg-black"} 
                cursor-pointer`}
                onClick={() => setSelectedMember(member)} // Set the selected member
              >
                <td className="text-gray-400 py-2 px-2 font-extralight text-sm">
                  {member.fullName}
                </td>
                <td className="text-gray-400 py-2 px-2 font-extralight text-sm">
                  {member.phoneNumber}
                </td>
                <td className="text-gray-400 py-2 px-2 font-extralight text-sm">
                  {member.createdAt.substring(0, 10)}
                </td>
                <td className="text-gray-400 py-2 px-2 font-extralight text-sm">
                  {member.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Member Section */}
      {selectedMember && (
        <div className="mt-10">
          <EditMember
            onCancel={() => setSelectedMember(null)}
            member={selectedMember} // Pass the selected member
            onUpdateSuccess={() => {
              setSelectedMember(null); // Close the editor after successful update
              fetchMembers(); // Refresh the member list
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ModeratorsList;
