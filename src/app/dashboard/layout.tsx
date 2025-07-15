import AppLayout from '@/components/layout/app-layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout title="Dashboard">{children}</AppLayout>;
}
