import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const [emailKeyword, setEmailKeyword] = useState("");

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const filteredUsers = users
    ?.filter((u) => u.role === "User")
    .filter((user) =>
      user.email.toLowerCase().includes(emailKeyword.toLowerCase())
    );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
          <input
            type="text"
            placeholder="Search by email..."
            value={emailKeyword}
            onChange={(e) => setEmailKeyword(e.target.value)}
            className="w-full sm:w-72 border p-2 border-gray-300 rounded-md"
          />
        </header>

        {filteredUsers && filteredUsers.length > 0 ? (
          <>
            <div className="mt-6 bg-white rounded-md shadow-lg hidden min-[1040px]:block">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-center">
                      No. of Books Borrowed
                    </th>
                    <th className="px-4 py-2 text-center">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2 text-center">
                        {user?.borrowedBooks.length}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1040px]:hidden">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="p-4 border rounded-lg shadow bg-white"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {index + 1}. {user.name}
                  </h3>
                  <p className="break-words">
                    <span className="font-medium">Email:</span>{" "}
                    <span className="ml-1 break-words">{user.email}</span>
                  </p>
                  <p>
                    <span className="font-medium">Role:</span> {user.role}
                  </p>
                  <p>
                    <span className="font-medium">Borrowed Books:</span>{" "}
                    {user?.borrowedBooks.length}
                  </p>
                  <p>
                    <span className="font-medium">Registered:</span>{" "}
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No registered users found in library.
          </h3>
        )}
      </main>
    </>
  );
};

export default Users;
