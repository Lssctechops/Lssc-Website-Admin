"use clint";
import NoticeUpdate from "@/ui/pages/NoticeUpdate";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <NoticeUpdate page={data.page} type={data?.type} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
