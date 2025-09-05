import React, { useState } from "react";

const Filter = ({ onFilterChange, categories, brands }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      sort: sortOrder,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        onBlur={handleFilterChange}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Brand Filter */}
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        onBlur={handleFilterChange}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* Sort Filter */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        onBlur={handleFilterChange}
        className="border px-2 py-1 rounded"
      >
        <option value="">Sort By</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priceAsc">Price Low → High</option>
        <option value="priceDesc">Price High → Low</option>
      </select>

      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};

export default Filter;
