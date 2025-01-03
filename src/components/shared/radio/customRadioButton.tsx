
  // Custom Radio Component
import React from 'react';

interface CustomRadioProps {
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

export const CustomRadio: React.FC<CustomRadioProps> = ({ label, checked, onChange, icon = null }) => (
    <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 
        hover:border-orange-500 hover:bg-orange-50">
        <div className="flex items-center h-5">
            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
        </div>
        <div className="flex items-center ml-4">
            {icon && <span className="mr-3">{icon}</span>}
            <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
    </label>
);

export default CustomRadio;