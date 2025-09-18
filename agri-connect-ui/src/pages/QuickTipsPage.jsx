import React, { useEffect, useState } from 'react';
import { getQuickTips } from '../services/api';

const QuickTipsPage = () => {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [dropdownCategory, setDropdownCategory] = useState('All');
  const [searchCategory, setSearchCategory] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'All',
    'Water',
    'Soil',
    'Irrigation',
    'Crop Management',
    'Seeds',
    'Crop Planning',
    'Weather',
    'Hygiene',
    'Pest Control',
    'Management',
    'Nursery',
    'Weed Control',
    'Plant Health',
    'Fertilizers',
    'Post-Harvest',
    'Market',
    'Safety',
    'Community',
  ];

  useEffect(() => {
    getQuickTips()
      .then((res) => {
        setTips(res.data);
        setFilteredTips(res.data);
      })
      .catch((err) => {
        console.error('Error fetching tips:', err);
        setError('Failed to fetch tips.');
      });
  }, []);

  const handleSearch = () => {
    const categoryToUse = searchCategory.trim()
      ? searchCategory.trim().toLowerCase()
      : dropdownCategory !== 'All'
      ? dropdownCategory.toLowerCase()
      : '';

    if (categoryToUse) {
      const filtered = tips.filter((tip) =>
        tip.category.toLowerCase().includes(categoryToUse)
      );
      setFilteredTips(filtered);
    } else {
      setFilteredTips(tips); // No filter, show all
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">🌿 Quick Farming Tips</h2>

        <div className="card card-hover p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Dropdown filter */}
            <select
              value={dropdownCategory}
              onChange={(e) => setDropdownCategory(e.target.value)}
              className="select w-56"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Manual text filter */}
            <input
              type="text"
              placeholder="Or type category name"
              className="input w-64"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />

            <button onClick={handleSearch} className="btn-primary px-4">Search</button>
          </div>
        </div>

        {error && <p className="alert-error text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="card card-hover p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{tip.title}</h3>
                <span className="badge-success">{tip.category}</span>
              </div>
              <p className="text-slate-700">{tip.content}</p>
            </div>
          ))}
          {filteredTips.length === 0 && (
            <p className="col-span-full text-center text-slate-600">No tips found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickTipsPage;
