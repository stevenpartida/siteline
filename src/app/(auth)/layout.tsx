export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col">
      {children}
    </div>
  );
}