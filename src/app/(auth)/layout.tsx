export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col max-w-lg mx-auto">
      {children}
    </div>
  );
}
