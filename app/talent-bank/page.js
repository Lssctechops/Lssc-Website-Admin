import Candidates from "@/ui/pages/Candidates";
import Talentbank from "@/ui/pages/Talentbank";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      {/* <Candidates page={data.page} keyword={data?.q} role={data?.role} /> */}
      <Talentbank page={data.page} />
    </MainLayout>
  );
};

export default page;
