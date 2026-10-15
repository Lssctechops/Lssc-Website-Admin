import HeroSection from "@/ui/pages/HeroSection";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <HeroSection page={data.page} />
    </MainLayout>
  );
};

export default page;
