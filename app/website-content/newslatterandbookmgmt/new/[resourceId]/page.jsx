import Addbookandnewslatter from "@/ui/molecules/Addbookandnewslatter";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { resourceId } = await params;
  return (
    <MainLayout>
      <Addbookandnewslatter resourceId={resourceId} />
    </MainLayout>
  );
};

export default page;
