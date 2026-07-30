export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth gating is handled by middleware; keep this layout minimal so
  // /admin/login is not wrapped in dashboard chrome or blocked by auth().
  return children;
}
