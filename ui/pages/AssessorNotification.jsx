import Link from "next/link";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Textarea from "../atoms/Textarea";
import ImageUploader from "../molecules/ImageUploader";

const AssessorNotification = () => {
  return (
    <section className="flex lg:gap-4">
      <Link href={"/assessor"}>
        <i className="ri-arrow-left-line hidden lg:block ri-2x"></i>
      </Link>
      <div className=" lg:p-10 space-y-6 p-3 w-full bg-white rounded-xl">
        <div className="flex flex-col gap-6 items-center justify-center gap">
          <h2 className="text-secondary font-bold text-3xl">Notification</h2>
          <div className="rounded-xl shadow space-y-4 lg:w-[80%] p-4 border border-[#E6E7EA]">
            <Select label={"For"} options={["Trainers"]} />
            <Input label={"Title"} placeholder={"Enter Title"} />
            <Textarea
              label={"Description"}
              placeholder={"Write about location"}
            />
            <div className="flex gap-6">
              <Button
                style={"w-full border border-[#E6E7EA]"}
                label={"Cancel"}
              />{" "}
              <Button style={"bg-[#0070BA] text-white w-full"} label={"Send"} />
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>
    </section>
  );
};

export default AssessorNotification;
