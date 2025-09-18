import React, { useEffect, useState } from "react";
import { getMarketPrices } from "../services/api";

const MarketPricesPage = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMarketPrices()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPrices(data);
        setFilteredPrices(data);
      })
      .catch((err) => {
        console.error("Error fetching market prices:", err);
        setPrices([]);
        setFilteredPrices([]);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = prices.filter((item) =>
      item.crop.toLowerCase().includes(query) ||
      item.market.toLowerCase().includes(query)
    );
    setFilteredPrices(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app">
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 flex items-center gap-2">🌾 Market Price Dashboard</h1>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Search by crop or market"
          className="input mb-6"
        />

        <div className="card card-hover overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.length > 0 ? (
                filteredPrices.map((item, index) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2">{item.crop}</td>
                    <td className="px-4 py-2">{item.market}</td>
                    <td className="px-4 py-2">
                      <span className="badge-success">{item.state}</span>
                    </td>
                    <td className="px-4 py-2 text-green-700 font-semibold">₹{item.price}</td>
                    <td className="px-4 py-2">
                      <span className="badge-info bg-slate-100 text-slate-700 border-slate-200">{item.unit}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-slate-600 py-6">
                    No matching results. Try a different crop or market.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketPricesPage;
