"use client";

import { Box, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StandingPouchIcon,
  PillowPouchIcon,
  BoxIcon,
  JarIcon,
  BottleIcon,
  SachetIcon,
} from "@/components/icons/packaging-icons";

interface PackagingType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const packagingTypes: PackagingType[] = [
  {
    id: "standing-pouch",
    name: "Standing Pouch",
    description: "Vertical stand-up bag",
    icon: <StandingPouchIcon className="w-5 h-5" />,
  },
  {
    id: "pillow-pouch",
    name: "Pillow Pouch",
    description: "Horizontal sealed bag",
    icon: <PillowPouchIcon className="w-5 h-5" />,
  },
  {
    id: "box",
    name: "Box",
    description: "Cardboard packaging",
    icon: <BoxIcon className="w-5 h-5" />,
  },
  {
    id: "jar",
    name: "Jar",
    description: "Glass or plastic jar",
    icon: <JarIcon className="w-5 h-5" />,
  },
  {
    id: "bottle",
    name: "Bottle",
    description: "Beverage bottle",
    icon: <BottleIcon className="w-5 h-5" />,
  },
  {
    id: "sachet",
    name: "Sachet",
    description: "Small single-serve pack",
    icon: <SachetIcon className="w-5 h-5" />,
  },
];

interface PackagingTypeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PackagingTypeSelector({ selected, onSelect }: PackagingTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Box className="w-4 h-4 text-[#F97316]" />
        <label className="text-sm font-semibold text-[#1A1A1A]">
          Packaging Type
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {packagingTypes.map((type) => {
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                "relative p-3 rounded-xl border-2 text-left transition-all duration-300 ease-out",
                isSelected
                  ? "border-[#F97316] bg-[#F97316]/10"
                  : "border-[#E5E4E0] bg-white hover:border-[#F97316]/70 hover:bg-[#F97316]/[0.07] hover:-translate-y-0.5 hover:shadow-sm"
              )}
            >
              {/* Checkmark badge — kept in DOM so it can animate in/out */}
              <span
                className={cn(
                  "absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center transition-all duration-200 ease-out",
                  isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>

              <div
                className={cn(
                  "mb-2 transition-colors duration-300 ease-out",
                  isSelected ? "text-[#F97316]" : "text-[#737373]"
                )}
              >
                {type.icon}
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">
                {type.name}
              </h3>
              <p className="text-xs text-[#737373]">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
