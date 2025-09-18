import React, { useState } from 'react';
import { createListing } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    contact: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      const formData = new FormData();
      for (let key in form) {
       formData.append(key, form[key]);
      }
      await createListing(formData);
      navigate('/marketplace');
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app max-w-2xl">
        <div className="card card-hover p-6">
          <h2 className="text-2xl font-extrabold text-green-800 mb-4">Add New Listing</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" placeholder="e.g., High-yield wheat seeds" className="input" value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea id="description" name="description" placeholder="Short description" className="textarea" value={form.description} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="price">Price (₹)</label>
                <input id="price" type="number" name="price" placeholder="Amount" className="input" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="category">Category</label>
                <select id="category" name="category" className="select" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="Tools">Tools</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="location">Location</label>
                <input id="location" name="location" placeholder="Village / City" className="input" value={form.location} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="contact">Phone Number</label>
                <input id="contact" name="contact" placeholder="Seller contact" className="input" value={form.contact} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="image">Image</label>
              <input id="image" type="file" name="image" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="block" />
              <p className="help-text">Upload a clear product image (JPG/PNG).</p>
            </div>

            <button className="btn-primary px-4 py-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
