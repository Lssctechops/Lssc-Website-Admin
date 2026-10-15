import { getalldata } from "@/redux/slice/dashboard-slice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const StatsCard = ({ title, span, icon, count, growth, timeline }) => {
 
  return (
    <div className="bg-white w-full p-4 flex flex-col justify-between rounded-xl shadow-lg">
      <div className="flex justify-between  pb-6">
        <div className="space-y-3">
          <p className=" capitalize text-tertiary text-sm font-semibold">
            {title}
          </p>
          <span className="text-secondary text-2xl font-bold">{count}</span>
        </div>
        <Image
          className="w-14 h-14 "
          src={icon}
          alt="group"
          width="100"
          height="100"
        />
      </div>
      <p className="text-[#606060] font-semibold">
        <span className="text-[#00B69B]">
          <i className="ri-arrow-right-up-long-fill text-sm"></i> {growth}%{" "}
        </span>
        Up from {timeline}
      </p>
    </div>
  );
};

export default StatsCard;
