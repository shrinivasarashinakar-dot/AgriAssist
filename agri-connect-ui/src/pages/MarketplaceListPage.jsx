import React, { useEffect, useState } from 'react';
import { fetchListings, deleteListing } from '../services/api';
import { Link } from 'react-router-dom';

const MarketplaceListPage = () => {
  const [listings, setListings] = useState([]);
  const [showMyListings, setShowMyListings] = useState(false);
  const farmerPhone = JSON.parse(localStorage.getItem('farmer'))?.phone;

  useEffect(() => {
    fetchListings().then((res) => setListings(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredListings = showMyListings
    ? listings.filter((item) => item.contact === farmerPhone)
    : listings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-green-800">🌿 Marketplace</h2>
          <div className="flex gap-2">
            <Link to="/create-listing" className="btn-primary px-4 py-2">+ Add Listing</Link>
            <button
              onClick={() => setShowMyListings((prev) => !prev)}
              className={`px-4 py-2 rounded-md text-white ${showMyListings ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {showMyListings ? 'All Listings' : 'My Listings'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div key={item.id} className="card card-hover overflow-hidden relative">
              {item.image && (
                <img
                  src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-xl font-semibold text-green-800 mb-1">{item.title}</h3>
                <p className="text-slate-600 mb-1">{item.description?.slice(0, 80)}...</p>
                <p className="text-green-700 font-bold mb-1">₹{item.price}</p>
                <p className="text-sm text-slate-700">📍 {item.location}</p>
                <p className="text-sm text-slate-500">📞 {item.contact}</p>
                <span className="badge-warn mt-2">{item.category}</span>

                <Link to={`/listing/${item.id}`} className="block mt-4 text-green-700 hover:underline">
                  View Details
                </Link>

                {item.contact === farmerPhone && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 btn-danger px-2 py-1 text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <p className="text-center text-slate-600 mt-10">No listings found.</p>
        )}
      </div>
    </div>
  );
}

export default MarketplaceListPage;
