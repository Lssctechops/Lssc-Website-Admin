"use client";

import { getAlltalentformid } from "@/redux/slice/talent-slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Talentdetailpage = ({ talentId }) => {
  const dispatch = useDispatch();
  const [talent, setTalent] = useState(null);

  const getdetail = async () => {
    const res = await dispatch(getAlltalentformid(talentId));
    setTalent(res.payload?.data);
  };

  useEffect(() => {
    getdetail();
  }, [talentId]);

  if (!talent) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {talent.companyName}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <Detail label="Company Name" value= /> */}
        <Detail label="City" value={talent.city} />
        <Detail label="Age" value={talent.age} />
        <Detail label="Gender" value={talent.gender} />
        <Detail label="Total Workforce" value={talent.totalWorkforce} />
        <Detail
          label="Number of Candidates"
          value={talent.numberOfCandidates}
        />
        <Detail
          label="Quick Hiring"
          value={talent.quickHiring ? "Yes" : "No"}
        />
        <Detail
          label="Disability Preference"
          value={talent.disabilityPreference ? "Yes" : "No"}
        />
        <Detail
          label="Offer to Assessor"
          value={talent.offerToAssessor ? "Yes" : "No"}
        />
        <Detail
          label="Offer to Trainer"
          value={talent.offerToTrainer ? "Yes" : "No"}
        />
        <Detail
          label="Government Initiative"
          value={talent.governmentInitiativeParticipation ? "Yes" : "No"}
        />
        <Detail
          label="NSQF Aligned"
          value={talent.nsqfAligned ? "Yes" : "No"}
        />
        <Detail
          label="Support Curriculum Development"
          value={talent.supportCurriculumDevelopment ? "Yes" : "No"}
        />
        <Detail
          label="Support Industry Exposure"
          value={talent.supportIndustryExposure ? "Yes" : "No"}
        />
        <Detail
          label="Support Real Time Assessment"
          value={talent.supportRealTimeAssessment ? "Yes" : "No"}
        />
        <Detail
          label="Created At"
          value={new Date(talent.createdAt).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(talent.updatedAt).toLocaleString()}
        />
      </div>

      <div className="mt-4">
        <DetailList label="Job Roles" items={talent.jobRole} color="blue" />
        <DetailList label="Segments" items={talent.segment} color="green" />
        <DetailList
          label="Qualifications"
          items={talent.qualification}
          color="purple"
        />
      </div>

      <div className="mt-4">
        <span className="text-sm text-gray-500">Letter of Intent: </span>
        {talent.letterOfIntent ? (
          <a
            href={talent.letterOfIntent}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : (
          <span className="text-gray-600">N/A</span>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-base text-gray-800 font-medium">{value || "N/A"}</div>
  </div>
);

const DetailList = ({ label, items = [], color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="mb-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <span
              key={idx}
              className={`inline-block ${colorClasses[color]} text-xs px-2 py-1 rounded`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-gray-600">N/A</span>
        )}
      </div>
    </div>
  );
};

export default Talentdetailpage;
