import Addnewslatter from "@/ui/molecules/Addnewslatter";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { newsId } = await params;
  return (
    <MainLayout>
      <Addnewslatter newsId={newsId} />
    </MainLayout>
  );
};

export default page;
