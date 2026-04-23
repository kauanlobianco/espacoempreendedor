import { DashboardShell } from "@/components/layout/dashboard-shell";
import { STUDENT_NAV } from "@/lib/constants/domain";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell nav={STUDENT_NAV}>{children}</DashboardShell>;
}
