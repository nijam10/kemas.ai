"use client";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  isLoading,
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2";
  
  const variants = {
    // Orange Gradasi
    primary: "bg-gradient-to-br from-[#E4AB5A] to-[#D49840] text-white rounded-xl shadow-[0_10px_20px_-10px_rgba(228,171,90,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(228,171,90,0.6)] hover:scale-[1.02]",
    
    // VARIANT DARK (Disamakan dengan Start AI Design)
    // Warna dasar: #1D1D1F
    // Warna hover: #2D2D2F (bukan hitam pekat agar tidak kaku)
    dark: "bg-[#1D1D1F] text-white rounded-full shadow-lg hover:bg-[#2D2D2F] hover:translate-y-[-1px]",
    
    outline: "border border-zinc-200 bg-white text-zinc-600 rounded-xl hover:bg-zinc-50",
    ghost: "text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-[12px]",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}