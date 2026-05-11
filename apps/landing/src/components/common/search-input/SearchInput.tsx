import { Search } from "@/components/icons";

const SearchInput: React.FC = () => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search />
      </div>
      <input
        type="text"
        placeholder="ange för sökning..."
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:shadow-md text-gray-700 placeholder-gray-500 transition-all duration-200"
      />
    </div>
  );
};

export default SearchInput;
