import { LayoutDashboard, Users, CreditCard, Shield, Settings } from "lucide-react";

export const adminNavigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Credits",
    href: "/admin/credits",
    icon: CreditCard,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
