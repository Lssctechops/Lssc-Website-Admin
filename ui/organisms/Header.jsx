"use client";
import { useFetchUserOnLoad } from "@/hooks/useFetchUserOnLoad";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  useFetchUserOnLoad();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const [imgError, setImgError] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const avatar = user?.avatar || user?.userImage;
  const showImg = avatar && !imgError;

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
    } catch {}
    Cookies.remove("token", { path: "/" });
    router.push("/auth-page");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-3 shadow-sm md:px-8">
      <div className="flex items-center gap-4 sm:gap-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="outline-none md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-row items-center justify-end gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-gray-50"
        >
          {showImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-9 w-9 rounded-full object-cover"
              src={avatar}
              alt="profile"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2B3674] text-sm font-semibold text-white">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user?.name || "Admin"}
          </span>
        </Link>

        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <i className="ri-logout-circle-line text-base" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>

      {/* Logout confirm modal */}
      {showLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowLogout(false)}
        >
          <div
            className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Log out?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              You will be returned to the login page.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;