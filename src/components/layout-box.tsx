export default function LayoutBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-6 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {children}
    </div>
  );
}
