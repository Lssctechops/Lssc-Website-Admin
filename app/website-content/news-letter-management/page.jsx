import LetterManagement from "@/ui/pages/LetterManagement";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;

  return (
    <MainLayout>
      <LetterManagement page={data.page} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
