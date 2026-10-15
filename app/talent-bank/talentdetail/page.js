import Talentbank from "@/ui/pages/Talentbank";
import Talentdetailpage from "@/ui/pages/Talentdetailpage";
import MainLayout from "@/ui/templates/MainLayout";

const page = async () => {
  return (
    <MainLayout>
      <Talentdetailpage />
    </MainLayout>
  );
};

export default page;
