import Assessor from "@/ui/pages/Assessor";
import MainLayout from "@/ui/templates/MainLayout";
import { Suspense } from "react";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    // <Suspense fallback="Loading...">
    <MainLayout>
      <Assessor page={data.page} />
    </MainLayout>
    // </Suspense>
  );
};

export default page;
