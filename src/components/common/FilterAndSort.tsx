import React from 'react';

interface FilterAndSortProps {
  sortBy: string;
  filters: {
    price: string;
    level: string;
  };
  onSortChange: (sortBy: string) => void;
  onFilterChange: (filters: any) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({ sortBy, filters, onSortChange, onFilterChange }) => {

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };


  return (
    <div className="bg-white rounded-lg shadow-lg p-6 fixed top-38 right-12 w-64">
      <h2 className="text-xl font-semibold mb-4">Filter & Sort</h2>
      
      {/* Sort dropdown */}
      <div className="mb-4">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={handleSortChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Select option</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title_asc">Name: A to Z</option>
          <option value="title_desc">Name: Z to A</option>
        </select>
      </div>

      {/* Price range filter */}
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <select
          id="price"
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Prices</option>
          <option value="0-1000">0 - 1000</option>
          <option value="1001-5000">1001 - 5000</option>
          <option value="5001-10000">5001 - 10000</option>
          <option value="10000-+"> above 10000</option>
        </select>
      </div>

      {/* Level filter */}
      <div className="mb-4">
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level</label>
        <select
          id="level"
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>
    </div>
  );
};

export default FilterAndSort;