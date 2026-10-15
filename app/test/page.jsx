"use client";
import useFile from "@/hooks/useFile";
import MainLayout from "@/ui/templates/MainLayout";

const page = () => {
  const { fileUploading, fileDeleting, uploadFile, deleteFile } = useFile();
  const handleChange = async (e) => {
    const file = e.target.files[0];
    const fileData = await uploadFile(file);

    console.log(fileData);
  };
  return (
    <MainLayout>
      <div>
        <input
          onChange={handleChange}
          type="file"
          className="bg-yellow-500 border  border-amber-800 "
        />
      </div>
    </MainLayout>
  );
};

export default page;
