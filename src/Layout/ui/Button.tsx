// components/ui/Button.tsx
import React from "react";

// Define your custom props
interface CustomButtonProps {
  title: string;
  color?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

// Merge with built-in button props
type ButtonProps = CustomButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  title,
  color = "primary",
  size = "md",
  className = "",
  ...rest
}) => {
  // Tailwind style map (you can customize these)
  const colorClasses = {
    primary: "bg-[#B059F6] opacity-80 text-white hover:opacity-100",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`cursor-pointer rounded-lg font-medium transition-colors duration-200 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {title}
    </button>
  );
};
