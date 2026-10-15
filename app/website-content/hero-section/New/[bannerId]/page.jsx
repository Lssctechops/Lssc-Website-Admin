import Addnewbanner from "@/ui/molecules/Addnewbanner";
import HeroSection from "@/ui/pages/HeroSection";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { bannerId } = await params;
  return (
    <MainLayout>
      <Addnewbanner bannerId={bannerId} />
    </MainLayout>
  );
};

export default page;
