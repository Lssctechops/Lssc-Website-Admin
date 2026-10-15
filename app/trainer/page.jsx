import Trainer from "@/ui/pages/Trainer";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <Trainer page={data.page} />
    </MainLayout>
  );
};

export default page;
