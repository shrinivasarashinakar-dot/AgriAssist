import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmerLogin } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await farmerLogin(form);
      if (res.data && res.data.farmer) {
        localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
        localStorage.setItem('farmerPhone', res.data.farmer.phone);
        navigate('/dashboard'); // ✅ Use navigate
      } else {
        setMessage('Login failed! Please check your details.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Login failed! Please check your details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6 shadow-soft">
        <h2 className="text-2xl font-extrabold text-green-800 text-center mb-6">Farmer Login / Register</h2>

        <label className="label" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
          className="input mb-4"
        />

        <label className="label" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          name="phone"
          placeholder="e.g. 9876543210"
          value={form.phone}
          onChange={handleChange}
          required
          className="input mb-4"
        />

        <label className="label" htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          name="location"
          placeholder="Village / City"
          value={form.location}
          onChange={handleChange}
          required
          className="input mb-6"
        />

        <button type="submit" className="btn-primary w-full py-2">Submit</button>

        {message && <p className="alert-error mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
