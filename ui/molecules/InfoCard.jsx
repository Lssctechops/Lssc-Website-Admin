import Image from "next/image";
import Link from "next/link";

const InfoCard = ({ img, title, route, points }) => {
  return (
    <div className="rounded-xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex gap-4 items-center">
        <Image
          src={img}
          alt="info-img"
          className="w-20 h-20 object-cover rounded-lg"
          width={100}
          height={100}
        />
        <div>
          <h4 className="text-darkpurple capitalize font-semibold">{title}</h4>
          {points.map((point, i) => (
            <p key={i} className="text-[#A3AED0] capitalize text-sm">
              {point}
            </p>
          ))}
        </div>
      </div>
      <Link href={route}>
        <i className="ri-pencil-fill text-[#8F9BBA]"></i>
      </Link>
    </div>
  );
};

export default InfoCard;
