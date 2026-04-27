import {
  LayoutDashboard,
  Megaphone,
  Image as ImageIcon,
  Globe,
  Users,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard, description: "KPIs, spend pacing, and recent activity" },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, description: "All running and scheduled campaigns" },
  { href: "/creatives", label: "Creatives", icon: ImageIcon, description: "Ad creatives, approvals, performance" },
  { href: "/inventory", label: "Inventory", icon: Globe, description: "Placements, fill rate, viewability" },
  { href: "/audiences", label: "Audiences", icon: Users, description: "Segments, lookalikes, contextual targets" },
  { href: "/reports", label: "Reports", icon: FileBarChart, description: "Saved and scheduled reports" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Workspace, team, integrations" },
];
