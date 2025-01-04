// Custom Input Component
import React, { ChangeEvent } from "react";

interface CustomInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  placeholder?: string;
  tooltipText?: string;
  className?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  required = false,
  placeholder = "",
  className = "",

  tooltipText = "",
}) => (
  <div className='space-y-1'>
    {label &&  <label className='block text-sm font-medium text-gray-700'>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                focus:ring-orange-500 focus:border-transparent transition-shadow duration-200 ${className}`}
      title={tooltipText}
    />
  </div>
);

export default CustomInput;
