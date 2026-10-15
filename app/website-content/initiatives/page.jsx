import GalleryManagement from "@/ui/pages/GalleryManagement";
import MainLayout from "@/ui/templates/MainLayout";

const page = ({ searchParams }) => {
  let data = searchParams;
  return (
    <MainLayout>
      <GalleryManagement page={data.page} />
    </MainLayout>
  );
};

export default page;
