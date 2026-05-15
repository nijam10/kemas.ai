"use client";

import { Package, Box, Container } from "lucide-react";
import { cn } from "@/lib/utils";

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
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: "pillow-pouch",
    name: "Pillow Pouch",
    description: "Horizontal sealed bag",
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: "box",
    name: "Box",
    description: "Cardboard packaging",
    icon: <Box className="w-5 h-5" />,
  },
  {
    id: "jar",
    name: "Jar",
    description: "Glass or plastic jar",
    icon: <Container className="w-5 h-5" />,
  },
  {
    id: "bottle",
    name: "Bottle",
    description: "Beverage bottle",
    icon: <Container className="w-5 h-5" />,
  },
  {
    id: "sachet",
    name: "Sachet",
    description: "Small single-serve pack",
    icon: <Package className="w-5 h-5" />,
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

      <div className="grid grid-cols-2 gap-3">
        {packagingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200 text-left hover:border-[#F97316]/40 hover:bg-[#F97316]/5",
              selected === type.id
                ? "border-[#F97316] bg-[#F97316]/10"
                : "border-[#E5E4E0] bg-white"
            )}
          >
            <div className={cn(
              "mb-2",
              selected === type.id ? "text-[#F97316]" : "text-[#737373]"
            )}>
              {type.icon}
            </div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">
              {type.name}
            </h3>
            <p className="text-xs text-[#737373]">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
