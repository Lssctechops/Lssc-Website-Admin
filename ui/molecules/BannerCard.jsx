import { limitTextLength } from "@/utils/limitText";
import Image from "next/image";
import Link from "next/link";

const BannerCard = ({
  id,
  img,
  title,
  route,
  description,
  ondelete,
  onedit,
}) => {
  return (
    <div className="w-full max-w-md rounded-xl p-4 flex items-center justify-between bg-white shadow-lg overflow-hidden">
      {/* Left Section: Image + Title + Description */}
      <div className="flex items-center gap-4 overflow-hidden max-w-[70%] min-w-0">
        <Image
          src={img}
          alt="info-img"
          className="w-20 h-20 object-cover rounded-lg shrink-0"
          width={80}
          height={80}
        />
        <div className="min-w-0 max-w-full">
          <h4
            className="text-darkpurple capitalize font-semibold truncate whitespace-nowrap"
            title={title}
          >
            {limitTextLength(title, 25)}
          </h4>
          <p className="text-[#A3AED0] capitalize text-sm truncate">
            {description}
          </p>
        </div>
      </div>

      {/* Right Section: Icons */}
      <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
        {/* View icon */}
        <a href={img} target="_blank" rel="noopener noreferrer">
          <i className="ri-eye-line text-[#8F9BBA] ri-lg cursor-pointer" />
        </a>

        {/* Delete icon */}
        <span
          onClick={() => ondelete(id)}
          className="text-red-500 ri-delete-bin-6-line ri-xl cursor-pointer"
        />

        {/* Edit icon */}
        <Link
          href={`/website-content/hero-section/New/${id}`}
          className="ri-edit-box-line ri-xl cursor-pointer"
        />
      </div>
    </div>
  );
};

export default BannerCard;
