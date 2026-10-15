"use client";

import { getAllCandidatebyid } from "@/redux/slice/candidate-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Candidatedetailpage = ({ candidateId }) => {
  const dispatch = useDispatch();
  const [candidate, setCandidate] = useState(null);

  const getCandidateDetails = async () => {
    const res = await dispatch(getAllCandidatebyid(candidateId));
    setCandidate(res?.payload?.data);
  };

  useEffect(() => {
    getCandidateDetails();
  }, [candidateId]);

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading candidate details...</div>
      </div>
    );
  }

  const { personalDetails, educationDetails, course, createdAt, updatedAt } =
    candidate;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-lg shadow mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Candidate Profile
      </h1>

      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Name" value={personalDetails?.name} />
          <Detail label="Email" value={personalDetails?.email} />
          <Detail label="Mobile" value={personalDetails?.mobile} />
          <Detail label="Gender" value={personalDetails?.gender} />
          <Detail
            label="Date of Birth"
            value={new Date(personalDetails?.dob).toLocaleDateString()}
          />
          <Detail label="City" value={personalDetails?.city} />
          <Detail label="State" value={personalDetails?.state} />
          <Detail label="Pin Code" value={personalDetails?.pinCode} />
        </div>
      </Section>

      {/* Education Info */}
      {/* Education Info */}
      <Section title="Education Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail
            label="Qualification"
            value={educationDetails?.qualification}
          />
          <Detail label="University" value={educationDetails?.university} />
          <Detail
            label="Specialization"
            value={educationDetails?.specialization}
          />
          <Detail label="Passing Year" value={educationDetails?.passingYear} />
          <Detail label="Grade" value={educationDetails?.grade} />

          {/* Resume Button only if URL exists */}
          {educationDetails?.resumeUrl && (
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500">Resume</span>
              <button
                onClick={() => {
                  window.open(educationDetails.resumeUrl, "_blank");
                }}
                className="mt-1 px-4 cursor-pointer py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                View Resume
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Courses */}
      <Section title="Purchased Courses">
        {course && course.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {course.map((c) => (
              <span
                key={c._id}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm"
              >
                {c.title || `Course ID: ${c._id}`}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses purchased yet.</p>
        )}
      </Section>

      {/* Meta Info */}
      <Section title="Account Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail
            label="Created At"
            value={new Date(createdAt).toLocaleString()}
          />
          <Detail
            label="Updated At"
            value={new Date(updatedAt).toLocaleString()}
          />
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title || ""}</h2>
    <div className="bg-white p-4 rounded-md shadow-sm">{children || ""}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex flex-col mb-2">
    <span className="text-sm text-gray-500">{label || ""}</span>
    <span className="text-base text-gray-800 font-medium">
      {value || "N/A"}
    </span>
  </div>
);

export default Candidatedetailpage;
