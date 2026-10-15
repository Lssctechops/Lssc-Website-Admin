import Addnewnotice from "@/ui/molecules/Addnewnotice";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { noticeId } = await params;
  return (
    <MainLayout>
      <Addnewnotice noticeId={noticeId} />
    </MainLayout>
  );
};

export default page;
