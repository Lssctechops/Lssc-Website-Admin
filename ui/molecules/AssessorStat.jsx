import Image from "next/image";

const AssessorStat = ({ img, title, count }) => {
  return (
    <div className="bg-white flex  items-center gap-4 shadow rounded-xl px-3 py-4">
      <Image
        className="w-16 h-16"
        src={img}
        alt="user"
        width={100}
        height={100}
      />
      <div>
        <h2 className="text-secondary font-bold text-3xl">{count}</h2>
        <p className="text-[#202224] font-medium  text-lg">{title}</p>
      </div>
    </div>
  );
};

export default AssessorStat;
