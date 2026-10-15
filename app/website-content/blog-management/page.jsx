import BlogManagement from "@/ui/pages/BlogManagement";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <BlogManagement keyword={data?.q} type={data?.type} page={data.page} />
    </MainLayout>
  );
};

export default page;
