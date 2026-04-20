import Sidebar from "@/components/layout/Sidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#F9F6F3] text-gray-800">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </main>
  );
}