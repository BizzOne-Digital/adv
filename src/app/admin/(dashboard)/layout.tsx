import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminShell title="CAFBEX Admin" email={session?.user?.email}>
      {children}
    </AdminShell>
  );
}
