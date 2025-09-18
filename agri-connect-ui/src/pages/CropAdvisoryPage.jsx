import React, { useState } from 'react';
import { predictCrop } from '../services/api';
import { FaThermometerHalf, FaCloudRain, FaTint, FaVial, FaLeaf } from 'react-icons/fa';

const CropAdvisoryPage = () => {
  const [form, setForm] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      // Convert numeric inputs to numbers safely
      const payload = {
        N: Number(form.N),
        P: Number(form.P),
        K: Number(form.K),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall),
      };
      const res = await predictCrop(payload);
      if (res.data && res.data.recommended_crop) {
        setResult(res.data.recommended_crop);
      } else {
        setError('Prediction failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || 'Prediction failed. Please check inputs.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app max-w-xl">
        <div className="card card-hover p-6">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">🌾 AI Crop Advisory (Kaggle-based)</h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <FaLeaf className="text-green-700" />
                <input type="number" name="N" placeholder="Nitrogen (N)" value={form.N} onChange={handleChange} required className="input" />
              </div>
              <div className="flex items-center gap-2">
                <FaLeaf className="text-green-700" />
                <input type="number" name="P" placeholder="Phosphorus (P)" value={form.P} onChange={handleChange} required className="input" />
              </div>
              <div className="flex items-center gap-2">
                <FaLeaf className="text-green-700" />
                <input type="number" name="K" placeholder="Potassium (K)" value={form.K} onChange={handleChange} required className="input" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaThermometerHalf className="text-red-600" />
              <input type="number" name="temperature" placeholder="Temperature (°C)" value={form.temperature} onChange={handleChange} required className="input" />
            </div>

            <div className="flex items-center gap-2">
              <FaTint className="text-blue-600" />
              <input type="number" name="humidity" placeholder="Humidity (%)" value={form.humidity} onChange={handleChange} required className="input" />
            </div>

            <div className="flex items-center gap-2">
              <FaVial className="text-purple-600" />
              <input type="number" name="ph" placeholder="pH" value={form.ph} onChange={handleChange} step="0.01" required className="input" />
            </div>

            <div className="flex items-center gap-2">
              <FaCloudRain className="text-blue-600" />
              <input type="number" name="rainfall" placeholder="Rainfall (mm)" value={form.rainfall} onChange={handleChange} required className="input" />
            </div>

            <button type="submit" className="btn-primary w-full py-2">Get Advisory</button>
          </form>

          {result && (
            <div className="mt-6 text-center">
              <div className="alert-success">
                <p className="text-green-800 text-lg">✅ Recommended Crop: <span className="font-bold">{result}</span></p>
              </div>
            </div>
          )}

          {error && <p className="alert-error text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CropAdvisoryPage;
