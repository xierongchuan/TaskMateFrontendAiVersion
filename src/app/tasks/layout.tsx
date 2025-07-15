import AppLayout from '@/components/layout/app-layout';

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout title="Task Scheduler">{children}</AppLayout>;
}
