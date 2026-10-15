import Coordinates from "@/ui/pages/Coordinates";
import MainLayout from "@/ui/templates/MainLayout";
import React from "react";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <Coordinates page={data.page} keyword={data?.q} />
    </MainLayout>
  );
};

export default page;
