import AssessmentReport from "@/ui/pages/AssessmentReport";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { reportId } = await params;
  return (
    <MainLayout>
      <AssessmentReport reportId={reportId} />
    </MainLayout>
  );
};

export default page;
