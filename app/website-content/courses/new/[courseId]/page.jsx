import Addnewcourse from "@/ui/molecules/Addnewcourse";
import Courses from "@/ui/pages/Courses";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { courseId } = await params;
  return (
    <MainLayout>
      <Addnewcourse courseId={courseId} />
    </MainLayout>
  );
};

export default page;
