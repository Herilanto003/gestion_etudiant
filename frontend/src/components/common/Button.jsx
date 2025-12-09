import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-white text-black border border-gray-300 hover:bg-gray-200",
    secondary:
      "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "bg-transparent text-white border border-gray-600 hover:bg-gray-800",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
