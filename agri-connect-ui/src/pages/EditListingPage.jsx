// src/pages/EditListingPage.jsx
import React, { useEffect, useState } from 'react';
import { getListingDetail, updateListing } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const EditListingPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getListingDetail(id).then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    await updateListing(id, formData);
    navigate('/marketplace');
  };

  if (!form) return <p className="min-h-screen flex items-center justify-center text-slate-600 translatable">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app max-w-2xl">
        <div className="card card-hover p-6">
          <h2 className="text-2xl font-extrabold text-green-800 mb-4 translatable">Edit Listing</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" className="input" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea id="description" name="description" className="textarea" value={form.description} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="price">Price (₹)</label>
                <input id="price" name="price" type="number" className="input" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="category">Category</label>
                <input id="category" name="category" className="input" value={form.category} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="location">Location</label>
                <input id="location" name="location" className="input" value={form.location} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="contact">Phone Number</label>
                <input id="contact" name="contact" className="input" value={form.contact} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="image">Image</label>
              <input id="image" type="file" name="image" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="block" />
              <p className="help-text">Upload a clear product image (JPG/PNG).</p>
            </div>
            <button className="btn-primary px-4 py-2"><span className="translatable">Update</span></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;
