import Addblog from "@/ui/molecules/Addblog";
import BlogManagement from "@/ui/pages/BlogManagement";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { blogId } = await params;
  return (
    <MainLayout>
      <Addblog blogId={blogId} />
    </MainLayout>
  );
};

export default page;
