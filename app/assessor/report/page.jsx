import AssesorReport from "@/ui/pages/AssesorReport";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <AssesorReport page={data.page} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
