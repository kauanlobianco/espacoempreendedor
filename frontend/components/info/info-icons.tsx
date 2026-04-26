import {
  AlertTriangle,
  AlertOctagon,
  BadgeCheck,
  Ban,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Coins,
  Compass,
  CreditCard,
  DoorOpen,
  Eye,
  FileCheck2,
  FileEdit,
  FileSearch,
  FileText,
  Globe2,
  Hammer,
  Hourglass,
  KeyRound,
  ListChecks,
  Mail,
  MessageSquareWarning,
  Package,
  PauseCircle,
  PhoneCall,
  PiggyBank,
  Receipt,
  RefreshCcw,
  RotateCcw,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
  Truck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { createElement } from "react";
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type InfoIconComponent = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
>;

export const INFO_ICONS = {
  AlertTriangle,
  AlertOctagon,
  BadgeCheck,
  Ban,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Coins,
  Compass,
  CreditCard,
  DoorOpen,
  Eye,
  FileCheck2,
  FileEdit,
  FileSearch,
  FileText,
  Globe2,
  Hammer,
  Hourglass,
  KeyRound,
  ListChecks,
  Mail,
  MessageSquareWarning,
  Package,
  PauseCircle,
  PhoneCall,
  PiggyBank,
  Receipt,
  RefreshCcw,
  RotateCcw,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
  Truck,
  Users,
  Wallet,
  Wrench,
} satisfies Record<string, InfoIconComponent>;

export type InfoIconName = keyof typeof INFO_ICONS;

export function getInfoIcon(name?: InfoIconName): InfoIconComponent | undefined {
  return name ? INFO_ICONS[name] : undefined;
}

export function InfoIconView({
  name,
  className,
}: {
  name?: InfoIconName;
  className?: string;
}) {
  const Icon = getInfoIcon(name);
  return Icon ? createElement(Icon, { className }) : null;
}
