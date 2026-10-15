import Otpverify from "@/ui/pages/Otpverify";

const page = async ({ searchParams }) => {
  const { mobile } = await searchParams;
  return <Otpverify mobile={mobile} />;
};

export default page;
