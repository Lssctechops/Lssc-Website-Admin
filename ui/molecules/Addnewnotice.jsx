"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  createnotice,
  getnoticebyId,
  updatenotice,
} from "@/redux/slice/notice-slice";
import toast from "react-hot-toast";
import Select from "../atoms/Select";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import Button from "../atoms/Button";

const Addnewnotice = ({ noticeId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log(noticeId);

  const [formdata, setFormdata] = useState({
    type: "",
    title: "",
    content: "",
    hyperLink: "",
    createdAt: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔄 loader state

  useEffect(() => {
    const fetchNoticeDetails = async () => {
      if (!noticeId) return;

      try {
        const res = await dispatch(getnoticebyId(noticeId)).unwrap();
        const notice = res?.data?.[0];
        if (notice) {
          setFormdata({
            type: notice.type || "",
            title: notice.title || "",
            content: notice.content || "",
            hyperLink: notice.hyperLink || "",
            createdAt: notice.createdAt || "",
          });
        }
      } catch (error) {
        toast.error("Failed to fetch notice");
      }
    };

    fetchNoticeDetails();
  }, [noticeId]);

  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { type, title, content, hyperLink, createdAt } = formdata;
    // ✅ Check required fields first
    if (!type || !title || !content || !hyperLink || !createdAt) {
      setLoading(false);
      return setError("All fields are required");
    }
    if (content.trim().length < 20) {
      setLoading(false);
      return setError("Content must be at least 20 characters long");
    }
    if (title.trim().length < 5) {
      setLoading(false);
      return setError("Title must contain at least 5 words");
    }

    // ✅ Validate URL format if hyperlink is present
    if (hyperLink && !isValidUrl(hyperLink)) {
      setLoading(false);
      return setError("Please enter a valid URL");
    }

    try {
      if (noticeId) {
        const res = await dispatch(
          updatenotice({ id: noticeId, data: formdata })
        ).unwrap();
        toast.success(res.message);
      } else {
        const res = await dispatch(createnotice(formdata)).unwrap();
        console.log(res);
        toast.success(res.message);
      }

      router.push("/website-content/notices-updates");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {noticeId ? "Update Notice" : "Add Notice"}
      </h2>

      <Select
        name="type"
        onChange={handleChange}
        value={formdata.type}
        label="Type"
        options={["notice", "event"]}
      />
      <Input
        name="title"
        onChange={handleChange}
        value={formdata.title}
        label="Title"
        placeholder="Enter Title"
      />
      <Textarea
        name="content"
        label="Description"
        value={formdata.content}
        onChange={handleChange}
        placeholder="Minimum 20 words"
      />
      <Input
        name="hyperLink"
        value={formdata.hyperLink}
        onChange={handleChange}
        label="Hyperlink"
        placeholder="Enter Hyperlink"
      />
      <Input
        type={"date"}
        name="createdAt"
        value={formdata.createdAt}
        onChange={handleChange}
        label="Date"
        placeholder="Enter date.."
      />

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <div className="flex gap-4 mt-6">
        <Button
          style="w-full border border-gray-300"
          label="Cancel"
          onClick={() => router.push("/website-content/notices-updates")}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading} // disable when loading
          style={`bg-primary text-white w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          label={loading ? "Please wait..." : noticeId ? "Update" : "Submit"}
        />
      </div>
    </div>
  );
};

export default Addnewnotice;
