// const Select = ({name, label, icon, options, value, onChange }) => {
//   return (
//     <div className="flex w-full flex-col gap-1">
//       <label className="text-sm" htmlFor={name}>
//         {label}
//       </label>
//       <div className="border px-2 items-center bg-white flex gap-2 border-[#D1D5DB] rounded-lg">
//         {icon && <i className={`${icon} ri-lg `}></i>}
//         <select
//           className="w-full rounded-lg outline-0 py-2"
//           name={name}
//           id={name}
//           value={value}
//           onChange={onChange}
//         >
//           {options?.map((option, i) => (
//             <option key={i} value={option?.value || option}>
//               {option?.label || option}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Select;
// "use client";
// const Select = ({ select, name, label, icon, options, value, onChange }) => {
//   return (
//     <div className="flex w-full flex-col gap-1">
//       <label className="text-sm" htmlFor={name}>
//         {label}
//       </label>
//       <div className="border px-2 items-center bg-white flex gap-2 border-[#D1D5DB] rounded-lg">
//         {icon && <i className={`${icon} ri-lg`}></i>}
//         <select
//           className="w-full rounded-lg outline-0 py-2"
//           name={name}
//           id={name}
//           value={value}
//           onChange={(e) => onChange(e.target.value)} // ✅ Yeh line theek hai ab
//         >
//           <option value="">Select</option>
//           {options?.map((option, i) => (
//             <option key={i} value={option?.value || option}>
//               {option?.label || option}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Select;
"use client";

const Select = ({ select, name, label, icon, options, value, onChange }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>
      <div className="border px-2 items-center bg-white flex gap-2 border-[#D1D5DB] rounded-lg">
        {icon && <i className={`${icon} ri-lg`}></i>}
        <select
          className="w-full rounded-lg outline-0 py-2"
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(e)} // Pass the whole event here
        >
          <option value="">Select</option>
          {options?.map((option, i) => (
            <option key={i} value={option?.value || option}>
              {option?.label || option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;



