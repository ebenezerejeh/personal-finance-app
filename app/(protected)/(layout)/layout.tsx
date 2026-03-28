import Sidebar from '@/src/components/layout/Sidebar';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-beige-100 p-6 md:p-10 pb-24 md:pb-10">
        {children}
      </main>
    </div>
  );
}
