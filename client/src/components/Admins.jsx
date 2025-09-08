import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Admins = () => {
  const { users } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

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

  const checkLoginAdmin = (login_id, Admin_id) => login_id === Admin_id;

  const filteredAdmins = users
    ?.filter((u) => u.role === "Admin")
    .filter((admin) =>
      admin.email.toLowerCase().includes(emailKeyword.toLowerCase())
    );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Admins
          </h2>
          <input
            type="text"
            placeholder="Search by email..."
            value={emailKeyword}
            onChange={(e) => setEmailKeyword(e.target.value)}
            className="w-full sm:w-72 border p-2 border-gray-300 rounded-md"
          />
        </header>

        {filteredAdmins && filteredAdmins.length > 0 ? (
          <div className="mt-6">
            <div className="hidden min-[915px]:block overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-center">Role</th>
                    <th className="px-4 py-2 text-center">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr
                      key={admin._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {admin.name}
                        {checkLoginAdmin(user._id, admin._id) && (
                          <span className="ml-2 px-3 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                            Logged In
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{admin.email}</td>
                      <td className="px-4 py-2 text-center">{admin.role}</td>
                      <td className="px-4 py-2 text-center">
                        {formatDate(admin.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 min-[915px]:hidden">
              {filteredAdmins.map((admin, index) => (
                <div
                  key={admin._id}
                  className="border rounded-lg p-4 shadow bg-white"
                >
                  <p>
                    <span className="font-medium">ID:</span> {index + 1}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span> {admin.name}
                    {checkLoginAdmin(user._id, admin._id) && (
                      <span className="ml-2 px-3 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                        Logged In
                      </span>
                    )}
                  </p>
                  <p className="break-words">
                    <span className="font-medium">Email:</span>{" "}
                    <span className="ml-1 break-words">{admin.email}</span>
                  </p>
                  <p>
                    <span className="font-medium">Role:</span> {admin.role}
                  </p>
                  <p>
                    <span className="font-medium">Registered On:</span>{" "}
                    {formatDate(admin.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No registered admins found in library.
          </h3>
        )}
      </main>
    </>
  );
};

export default Admins;

