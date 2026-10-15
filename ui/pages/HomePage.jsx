"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import StatsCard from "../molecules/StatsCard";
import CertificationRate from "../charts/CertificationRate";
import { getalldata } from "@/redux/slice/dashboard-slice";

const HomePage = () => {
  const dispatch = useDispatch();
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await dispatch(getalldata());
      if (res?.payload) {
        setStatsData(res.payload);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  const stats = [
    {
      title: "total trainers",
      span: "trained",
      icon: "/icon/users.png",
      count: statsData?.totalTrainers ?? "Loading...",
      growth: "8.5",
      timeline: "yesterday",
    },
    {
      title: "total assessors",
      span: "",
      icon: "/icon/grow.png",
      count: statsData?.totalAssessors ?? "Loading...",
      growth: "1.3",
      timeline: "last week",
    },
    {
      title: "total assessments",
      span: "theory",
      icon: "/icon/product.png",
      count: statsData?.totalAssessments ?? "Loading...",
      growth: "4.3",
      timeline: "yesterday",
    },
    {
      title: "total batches",
      span: "",
      icon: "/icon/box.png",
      count: statsData?.totalBatches ?? "Loading...",
      growth: "1.8",
      timeline: "yesterday",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* <div className="rounded-xl shadow-lg h-96 bg-white p-4 col-span-3">
        <h2 className="text-secondary flex items-center justify-between text-xl font-semibold">
          Assessment Volume
          <select
            className="font-normal text-sm text-tertiary h-fit px-2 rounded border border-gray-300"
          >
            <option value="">January</option>
            <option value="">February</option>
            <option value="">March</option>
            <option value="">April</option>
          </select>
        </h2>

        <CertificationRate />
      </div> */}
    </section>
  );
};

export default HomePage;
