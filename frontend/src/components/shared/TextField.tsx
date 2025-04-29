import React from "react";

export default function TextField(
  {
    placeholder,
    onChange,
    value,
    ...props
  }: {
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    [key: string]: unknown;
  } = { placeholder: "", onChange: () => {}, value: "" }
) {
return (
    <input
        type="text"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 w-full"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        {...props}
    />
);
}
