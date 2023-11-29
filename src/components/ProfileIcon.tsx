import router from "next/router";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "@/contexts/UserContext";
import { supabase } from "@/utils/supabaseClient";

export const ProfileIcon = () => {
  const { user } = useContext(UserContext) ?? {};

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.reload();
  };

  useEffect(() => {
    const closeDropdown = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative">
      <button
        onClick={e => {
          e.stopPropagation();
          toggleDropdown();
        }}
        className="relative block"
      >
        {user ? (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-black">
            {user.email?.[0].toUpperCase()}
          </div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-black">
            👤
          </div>
        )}
      </button>
      {user && dropdownOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute right-0 mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg"
          style={{ minWidth: "max-content" }}
        >
          <div className="px-4 py-3">
            <p className="text-sm leading-5 text-black">Signed in as:</p>
            <p className="text-xs leading-5 text-gray-900">{user?.email}</p>
          </div>
          <div className="py-1">
            <a
              href="#"
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
