import AssessorDirectory from "@/ui/molecules/AssessorDirectory";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <AssessorDirectory page={data?.page} />
    </MainLayout>
  );
};

export default page;
