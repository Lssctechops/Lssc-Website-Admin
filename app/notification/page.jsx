import Notifications from "@/ui/pages/TrainerReport";
import MainLayout from "@/ui/templates/MainLayout";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback="Loading...">
      <MainLayout>
        <Notifications />
      </MainLayout>
    </Suspense>
  );
};

export default page;
