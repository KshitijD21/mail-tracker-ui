type StatCardProps = {
  label: string;
  value: number | string | undefined;
  desc: string;
  icon: React.ReactNode;
};

export default function StatCard({ label, value, desc, icon }: StatCardProps) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <div className="text-md font-medium text-black dark:text-gray-300 mb-1">
          {label}
        </div>
        <div className="flex flex-col items-start mt-5">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-400 ">
            {desc}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 shadow-inner">
        {icon}
      </div>
    </div>
  );
}
