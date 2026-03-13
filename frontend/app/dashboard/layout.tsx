import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Coach',
  description: 'Your personal coaching dashboard for goals, tasks, and check-ins',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
