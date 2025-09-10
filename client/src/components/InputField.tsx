import React from 'react';

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    id: string; // Unique ID for accessibility (htmlFor)
    placeholder?: string;
    disabled?: boolean;
    autoComplete?: string; // Added for better UX/accessibility
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    value,
    onChange,
    required = false,
    id,
    placeholder,
    disabled = false,
    autoComplete,
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                id={id}
                required={required}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete} // Pass through autoComplete prop
            />
        </div>
    );
};

export default InputField;