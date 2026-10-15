import AddCoordinates from "@/ui/pages/AddCoordinates";
import MainLayout from "@/ui/templates/MainLayout";

const page = async ({ params }) => {
  const { MapId } = await params;
  return (
    <MainLayout>
      <AddCoordinates MapId={MapId} />
    </MainLayout>
  );
};

export default page;
