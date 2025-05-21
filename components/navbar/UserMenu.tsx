"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { SafeUser } from "@/types";
import { signOut } from "next-auth/react";
import { useCallback, useState, useRef, useEffect } from "react";
import { AiOutlineMenu, AiOutlineBell, AiOutlineHome } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import NotificationList from "@/components/NotificationList";
import HostReservationsList from "@/components/HostReservationsList";

type Props = {
  currentUser?: SafeUser | null;
};

function UserMenu({ currentUser }: Props) {
  const router = useRouter();
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHostReservations, setShowHostReservations] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((v) => !v);
  }, []);

  const toggleHostReservations = useCallback(() => {
    setShowHostReservations((v) => !v);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModel.onOpen();
    }

    rentModel.onOpen();
  }, [currentUser, loginModel, rentModel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hostRef.current && !hostRef.current.contains(event.target as Node)) {
        setShowHostReservations(false);
      }
    }
    if (showHostReservations) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHostReservations]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          onClick={onRent}
        >
          Airbnb your Home
        </div>
        <div className="relative flex items-center">
          <button
            className="p-2 rounded-full hover:bg-neutral-100 transition relative"
            onClick={toggleNotifications}
            aria-label="Notifications"
            type="button"
          >
            <AiOutlineBell size={22} />
            {/* Badge số lượng notification chưa đọc (nếu muốn) */}
            {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl z-50">
              <NotificationList />
            </div>
          )}
        </div>
        <div className="relative flex items-center" ref={hostRef}>
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-full border border-blue-500 text-blue-600 font-semibold bg-white shadow-sm hover:bg-blue-50 transition relative ${showHostReservations ? 'ring-2 ring-blue-200' : ''}`}
            onClick={toggleHostReservations}
            aria-label="Host Reservations"
            type="button"
          >
            <AiOutlineHome size={18} />
            <span className="text-sm font-medium">Host</span>
            <svg className={`ml-1 w-3 h-3 transition-transform ${showHostReservations ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showHostReservations && (
            <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl border border-blue-200 rounded-xl z-50 animate-fadeIn">
              {/* Arrow */}
              <div className="absolute -top-2 right-6 w-4 h-4 overflow-hidden">
                <div className="w-4 h-4 bg-white border-l border-t border-blue-200 rotate-45 transform origin-bottom-left shadow-md"></div>
              </div>
              <div className="p-4">
                <HostReservationsList />
              </div>
            </div>
          )}
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {currentUser ? (
              <Avatar src={currentUser?.image!} userName={currentUser?.name} />
            ) : (
              <Image
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src="/assets/avatar.png"
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push("/trips")}
                  label="My trips"
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="My favorites"
                />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="My reservations"
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="My properties"
                />
                <MenuItem onClick={onRent} label="Airbnb your home" />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModel.onOpen} label="Login" />
                <MenuItem onClick={registerModel.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
