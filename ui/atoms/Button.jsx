const Button = ({ label, onClick, icon, style, disabled, type }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${style} text-nowrap cursor-pointer flex items-center justify-center gap-4  px-6 py-3 font-medium rounded-md disabled:opacity-50`}
    >
      {icon && <i className={`${icon} ri-lg`}></i>} {label}
    </button>
  );
};

export default Button;
