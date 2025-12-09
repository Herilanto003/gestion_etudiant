import React from "react";

const Input = ({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`input-field ${
          error ? "border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
