import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { useDispatch, useSelector } from "react-redux";
import { createuser } from "@/redux/slice/user-slice";
import toast from "react-hot-toast";
import { getallcordinate } from "@/redux/slice/cordinate-slice";
import { getallcourse } from "@/redux/slice/course-slice";
import useFile from "@/hooks/useFile";

const AddAssessor = ({ onClose, refreshTrainerList }) => {
  const dispatch = useDispatch();
  const [Error, setError] = useState("");
  const { uploadFile } = useFile();

  const [Segment, setSegment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Course, setCourse] = useState([]);
  const [fileUploading, setFileUploading] = useState({});

  console.log(Segment);
  const map = useSelector((state) => state.cordinate);

  const [formdata, setformdata] = useState({
    name: "",
    center: "",
    id: "",
    password: "",
    mobile: "",
    Specialization: "",
    gender: "",
    category: "",
    dateOfBirth: "",
    email: "",
    startDate: "",
    endDate: "",
    specialization: "",
  });

  useEffect(() => {
    const getallcordinates = async () => {
      const res = await dispatch(getallcordinate());
      const formatted = res.payload.data?.map((seg) => ({
        label: seg.title,
        value: seg._id,
      }));
      setSegment(formatted || []);
    };
    getallcordinates();
  }, []);
  useEffect(() => {
    const getallcourseqp = async () => {
      const res = await dispatch(getallcourse());
      console.log(res);

      const formatteds = res.payload.data?.map((course) => ({
        label: `${course.title} (${course.qp_code})`,
        value: course.qp_code,
      }));

      setCourse(formatteds || []);
    };
    getallcourseqp();
  }, []);

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    return today.toISOString().split("T")[0];
  };
  const maxJoiningDate = getMaxDate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be 5 MB or less.");
      return;
    }

    setFileUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const uploaded = await uploadFile(file);
      if (!uploaded?.image) throw new Error("Upload failed");
      setformdata((prev) => ({ ...prev, [key]: uploaded.image }));
      toast.success(`${key} uploaded successfully`);
    } catch {
      toast.error(`Failed to upload ${key}`);
    } finally {
      setFileUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formdata.name) {
      setLoading(false);
      return setError("Please enter name");
    }

    const today = new Date();
    const maxDate = new Date();
    today.setHours(0, 0, 0, 0);
    maxDate.setFullYear(today.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formdata.joiningDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > maxDate) {
      setLoading(false);
      return setError("Joining date cannot be more than 1 year from today");
    }
    if (selectedDate < today) {
      setLoading(false);
      return setError("Joining date cannot be in the past");
    }

    if (!formdata.center) {
      setLoading(false);
      return setError("Please enter center");
    }
    if (!formdata.id) {
      setLoading(false);
      return setError("Please enter ID");
    }
    if (!formdata.password) {
      setLoading(false);
      return setError("Please enter password");
    }
    if (!formdata.mobile) {
      setLoading(false);
      return setError("Please enter mobile");
    }
    if (!formdata.email) {
      setLoading(false);
      return setError("Please enter email");
    }
    if (!formdata.category) {
      setLoading(false);
      return setError("please enter category");
    }
    if (!formdata.gender) {
      setLoading(false);
      return setError("please enter gender");
    }
    if (!formdata.dateOfBirth) {
      setLoading(false);
      return setError("please enter dateOfBirth");
    }
    if (!formdata.startDate) {
      setLoading(false);
      return setError("please enter startDate");
    }
    if (!formdata.endDate) {
      setLoading(false);
      return setError("please enter endDate");
    }
    if (!formdata.aadhaar) {
      setLoading(false);
      return setError("please enter aadhaar");
    }
    if (!formdata.pan) {
      setLoading(false);
      return setError("please enter pancard");
    }
    if (!formdata.bank) {
      setLoading(false);
      return setError("please enter bankpassbook");
    }

    const payload = {
      employeeId: formdata.id,
      name: formdata.name,
      password: formdata.password,
      mobile: formdata.mobile,
      role: "assessor",
      specialization: formdata.Specialization,
      locationId: formdata.center,
      email: formdata.email,
      gender: formdata.gender,
      specialization: formdata.specialization,
      category: formdata.category,
      dateOfBirth: formdata.dateOfBirth,
      startDate: formdata.startDate,
      endDate: formdata.endDate,
      aadhaar: formdata.aadhaar,
      pan: formdata.pan,
      bank: formdata.bank,
    };

    try {
      await dispatch(createuser(payload)).unwrap();
      toast.success("Assessor added successfully");
      if (refreshTrainerList) refreshTrainerList();
      onClose();
    } catch (error) {
      console.error(error);

      const apiError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";

      if (apiError.includes("E11000")) {
        toast.error("Duplicate Uniq identification number is not allowed");
      } else {
        toast.error(apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 max-h-screen overflow-y-auto">
      <h4 className="text-center text-2xl">Add New Assessor</h4>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex lg:flex-row flex-col gap-6">
          <Input
            label="UIN (Uniq Identification Number)"
            placeholder="023456789"
            type="text"
            name="id"
            value={formdata.id}
            onChange={handleChange}
          />
          <Input
            label="Name"
            placeholder="Add Trainer Name"
            name="name"
            value={formdata.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-6">
          <Select
            label="Gender"
            name="gender"
            value={formdata.gender}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            onChange={handleChange}
          />
          <Select
            label="Category"
            name="category"
            value={formdata.category}
            options={[
              { label: "General", value: "general" },
              { label: "OBC", value: "obc" },
              { label: "SC", value: "sc" },
              { label: "Other", value: "other" },
            ]}
            onChange={handleChange}
          />
        </div>
        <div className="flex lg:flex-row flex-col gap-6">
          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formdata.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            label="Email Id"
            type="email"
            placeholder="abc@gmail.com"
            name="email"
            value={formdata.email}
            onChange={handleChange}
          />
        </div>
        <h3 className="font-bold">Certification Validity</h3>
        <div className="flex lg:flex-row flex-col gap-6">
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formdata.startDate}
            onChange={handleChange}
          />
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={formdata.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-6">
          <Select
            label="Center"
            options={Segment}
            name="center"
            value={formdata.center}
            onChange={handleChange}
          />

          <Input
            label="Password"
            placeholder="Add password"
            type="text"
            name="password"
            value={formdata.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-6">
          <Input
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            type="number"
            name="mobile"
            value={formdata.mobile}
            onChange={handleChange}
          />
          <Select
            required
            label="Course"
            options={Course} // 👈 updated state
            name="specialization"
            value={formdata.specialization}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-3">
          {[
            { label: "Aadhar", key: "aadhaar" },
            { label: "Pancard", key: "pan" },
            { label: "Bank Passbook", key: "bank" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Upload {label} Image
              </label>
              <input
                required
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => handleFileUpload(e, key)}
                disabled={fileUploading[key]}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              {fileUploading[key] && (
                <p className="text-sm text-yellow-500 animate-pulse">
                  Uploading…
                </p>
              )}
              {formdata[key] && (
                <p className="text-sm text-green-600 break-words">
                  Uploaded: <span className="font-medium">{formdata[key]}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-red-500">{Error}</p>

        <div className="flex cursor-default justify-center gap-8">
          <Button
            onClick={onClose}
            label="Cancel"
            style="border border-[#9CA3AF]"
            type="button"
            disabled={loading}
          />
          <Button
            label={loading ? "Creating..." : "Create Assessor"}
            style="text-white bg-[#3182CD]"
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddAssessor;
