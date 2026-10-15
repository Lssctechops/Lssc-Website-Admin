import Userdetails from "@/ui/pages/Userdetails";
import MainLayout from "@/ui/templates/MainLayout";

const page = async () => {
  return (
    <MainLayout>
      <Userdetails />
    </MainLayout>
  );
};

export default page;
