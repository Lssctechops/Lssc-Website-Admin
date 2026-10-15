import TrainerReport from "@/ui/pages/TrainerReport";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <TrainerReport page={data.page} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
