const Input = ({
  label,
  name,
  type,
  value,
  placeholder,
  icon,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <label className="text-sm " htmlFor="">
        {label}
      </label>
      <div className="border px-2 items-center bg-white flex gap-2 border-[#D1D5DB] rounded-lg">
        {icon && <i className={`${icon} ri-lg text-[#9CA3AF]`}></i>}
        <input
          className=" w-full rounded-lg outline-0 py-2 "   
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

export default Input;
