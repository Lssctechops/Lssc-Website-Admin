"use client";
import Link from "next/link";
import { useState } from "react";

const DashboardLink = ({
  active = false,
  label = "Label",
  heroIcon,
  subMenu = [],
  route = "#",
  handleClick = () => {},
}) => {
  const [isSubMenOpen, setIsSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setIsSubMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col gap-2">
      <li
        onClick={handleClick}
        className="flex w-full items-center justify-between"
      >
        <Link
          href={route}
          onClick={toggleSubMenu}
          className={`${
            active ? "bg-primary text-white" : "bg-transparent text-secondary"
          } flex w-full flex-row items-center justify-between rounded-md px-4 py-3 transition-all duration-200 `}
        >
          <span className="text-md flex items-center gap-3">
            <i className={`${heroIcon} ri-lg text-[18px]`}></i>
            <span className="text-[14px] font-medium capitalize">{label}</span>
          </span>
          {subMenu.length > 0 && (
            <span className="text-[14px] font-medium capitalize">
              <i
                className={` ${active ? "text-gray-600" : "text-gray-400"} ${
                  isSubMenOpen
                    ? "ri-arrow-down-s-line"
                    : "ri-arrow-right-s-line"
                } ri-lg`}
              ></i>
            </span>
          )}
        </Link>
      </li>
      {subMenu.length > 0 && (
        <div className={`flex-col gap-1 ${isSubMenOpen ? "flex" : "hidden"}`}>
          {subMenu.map((item, index) => (
            <Link
              key={index}
              href={item.route}
              className="ms-4 flex w-[85%] flex-row items-center rounded-md px-3 py-2.5 text-gray-400 transition-all duration-200 hover:bg-amber-50 hover:text-gray-600"
            >
              <span>
                <i className={`${item.icon} ri-lg`}></i>
              </span>
              <span className="text-sm font-medium capitalize">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLink;
