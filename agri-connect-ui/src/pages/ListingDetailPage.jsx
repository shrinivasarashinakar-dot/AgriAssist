import React, { useEffect, useState } from 'react';
import { getListingDetail } from '../services/api';
import { useParams } from 'react-router-dom';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

//   useEffect(() => {
//     getListingDetail(id).then(res => setListing(res.data));
//   }, [id]);

useEffect(() => {
  getListingDetail(id).then(res => {
    console.log("Image Path:", res.data.image); // ✅ Debug here
    setListing(res.data);
  });
}, [id]);


  if (!listing) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app max-w-3xl">
        <div className="card card-hover overflow-hidden">
          {listing.image && (
            <img
              src={listing.image.startsWith('http') ? listing.image : `http://127.0.0.1:8000${listing.image}`}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
          )}
          <div className="p-6">
            <h2 className="text-3xl font-extrabold text-green-800 mb-2">{listing.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="badge-warn">{listing.category}</span>
              <span className="badge-info bg-slate-100 text-slate-700 border-slate-200">₹{listing.price}</span>
              <span className="badge-success">📍 {listing.location}</span>
            </div>
            <p className="text-slate-700 mb-4">{listing.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="card p-3">
                <span className="text-slate-500">Contact</span>
                <div className="font-medium">{listing.contact}</div>
              </div>
              <div className="card p-3">
                <span className="text-slate-500">Posted on</span>
                <div className="font-medium">{new Date(listing.date_posted).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
