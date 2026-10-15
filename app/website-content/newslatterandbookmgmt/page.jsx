import Resourcepdf from "@/ui/pages/Resourcepdf";
import MainLayout from "@/ui/templates/MainLayout";
import React from "react";

const page = async ({ searchParams }) => {
  let data = await searchParams;
  return (
    <MainLayout>
      <Resourcepdf page={data.page} />
    </MainLayout>
  );
};

export default page;
