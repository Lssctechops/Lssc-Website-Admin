import Userdetails from "@/ui/pages/Userdetails";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  let { userId } = await params;
  return (
    <MainLayout>
      <Userdetails userId={userId} />
    </MainLayout>
  );
};

export default page;
