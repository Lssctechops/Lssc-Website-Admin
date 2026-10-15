import Candidatedetailpage from "@/ui/pages/Candidatedetailpage";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <Candidatedetailpage
        page={data.page}
        keyword={data?.q}
        role={data?.role}
      />
    </MainLayout>
  );
};

export default page;
