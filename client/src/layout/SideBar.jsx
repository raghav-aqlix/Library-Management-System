import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { SidebarOpen } from "lucide-react";

import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);
  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Admins")}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Admins</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}
          {isAuthenticated && user?.role === "User" && (
            <button
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              onClick={() => setSelectedComponent("My Borrowed Books")}
            >
              <img src={catalogIcon} alt="icon" />
              <span>My Borrowed Books</span>
            </button>
          )}
          <button
            className="md:hidden w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" /> <span>Log Out</span>
          </button>
        </div>
        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!SidebarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
