import Courses from "@/ui/pages/Courses";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;

  return (
    <MainLayout>
      <Courses page={data.page} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
