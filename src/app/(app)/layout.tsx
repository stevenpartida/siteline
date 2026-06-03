import MobileNav from "@/components/mobile/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col max-w-lg mx-auto">
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      {/*Navigation goes here */}
      <MobileNav />
    </div>
  );
}
