import Candidatedetailpage from "@/ui/pages/Candidatedetailpage";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { candidateId } = await params;
  return (
    <MainLayout>
      <Candidatedetailpage candidateId={candidateId} />
    </MainLayout>
  );
};

export default page;
