const Textarea = ({
  name,
  style,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <label className="text-sm " htmlFor={name}>
        {label}
      </label>
      <textarea
        className={` ${style} border min-h-20 px-2 bg-background gap-2 border-[#D1D5DB]  w-full rounded-lg outline-0 py-2 `}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Textarea;
