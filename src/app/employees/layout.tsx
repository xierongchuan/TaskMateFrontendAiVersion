import AppLayout from '@/components/layout/app-layout';

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout title="Employee Schedule">{children}</AppLayout>;
}
