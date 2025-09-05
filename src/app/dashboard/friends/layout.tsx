// dashboard/layout.tsx
export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main> {/* MUST include children */}
    </div>
  );
}
