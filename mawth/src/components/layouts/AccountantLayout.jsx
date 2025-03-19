// AccountantLayout.jsx
export const AccountantLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-white shadow-lg">
        {/* Accountant specific sidebar navigation */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Accounts Dashboard</h2>
          {/* Add accountant-specific navigation items */}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
};