import Candidates from "@/ui/pages/Candidates";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <Candidates page={data.page} keyword={data?.q} role={data?.role} />
    </MainLayout>
  );
};

export default page;
