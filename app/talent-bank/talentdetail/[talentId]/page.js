import Talentbank from "@/ui/pages/Talentbank";
import Talentdetailpage from "@/ui/pages/Talentdetailpage";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { talentId } = await params;
  return (
    <MainLayout>
      <Talentdetailpage talentId={talentId} />
    </MainLayout>
  );
};

export default page;
