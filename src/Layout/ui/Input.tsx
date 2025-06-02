import { useEffect, useState, ChangeEvent } from "react";
import React from "react";

type CustomInputProps = {
  customSize?: "sm" | "md" | "lg";
  bgColor?: string;
  icon?: string; // Name of the icon file without .svg
  query?: string;
  setQuery?: (value: string) => void;
};

const sizeClasses = {
  sm: "text-sm py-1 px-3",
  md: "text-base py-2 px-4",
  lg: "text-lg py-3 px-5",
};

type InputProps = CustomInputProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  customSize = "md",
  bgColor = "bg-gray-100",
  icon,
  query,
  setQuery,
  ...rest
}: InputProps) => {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (icon) {
      import(`../assets/icons/${icon}.svg?react`)
        .then((module) => setIconComponent(() => module.default))
        .catch((err) => {
          console.error(`Icon "${icon}" could not be loaded.`, err);
          setIconComponent(null);
        });
    } else {
      setIconComponent(null);
    }
  }, [icon]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // setQuery(e.target.value);
  };

  return (
    <div className="relative w-full">
      {IconComponent && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <IconComponent className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        type="text"
        // value={query}
        //onChange={handleChange}
        className={`
          ${bgColor} ${sizeClasses[customSize]} w-full rounded-3xl pl-${IconComponent ? "10" : "4"} pr-4 focus:outline-none
        `}
        // placeholder="Search..."
        {...rest}
      />
    </div>
  );
};
