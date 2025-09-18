import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdPriceChange, MdOutlineWbSunny, MdTipsAndUpdates, MdStorefront, MdPublic } from 'react-icons/md';
import { GiPlantSeed, GiFarmTractor } from 'react-icons/gi';
import { RiRobot2Line } from 'react-icons/ri';
// Language functionality removed

const features = [
  {
    name: 'Market Price',
    route: '/market-prices',
    translationKey: 'feature_market_prices',
    icon: <MdPriceChange className="text-2xl" />,
    tagline: 'Live mandi prices and trends',
  },
  {
    name: 'Weather',
    route: '/weather',
    translationKey: 'feature_weather',
    icon: <MdOutlineWbSunny className="text-2xl" />,
    tagline: 'Hyperlocal forecast for your farm',
  },
  {
    name: 'AI-Based Crop Advisory',
    route: '/advisory',
    translationKey: 'feature_ai_advisory',
    icon: <GiPlantSeed className="text-2xl" />,
    tagline: 'Kaggle-powered crop recommendations',
  },
  {
    name: 'Quick Tips',
    route: '/quick-tips',
    translationKey: 'feature_quick_tips',
    icon: <MdTipsAndUpdates className="text-2xl" />,
    tagline: 'Best practices for higher yield',
  },
  {
    name: 'Marketplace',
    route: '/marketplace',
    translationKey: 'feature_marketplace',
    icon: <MdStorefront className="text-2xl" />,
    tagline: 'Buy and sell farm products',
  },
  {
    name: 'Ask AI',
    route: '/ask-ai',
    translationKey: 'feature_ask_ai',
    icon: <RiRobot2Line className="text-2xl" />,
    tagline: 'Ask agriculture-only AI assistant',
  },
  {
    name: 'Government Schemes',
    translationKey: 'feature_gov_schemes',
    externalUrl: 'https://www.myscheme.gov.in/search/category/Agriculture%2CRural%20%26%20Environment',
    icon: <MdPublic className="text-2xl" />,
    tagline: 'Explore benefits without leaving the app',
  },
];

const DashboardPage = () => {
  const [farmer, setFarmer] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const stored = localStorage.getItem('farmer');
    if (stored) {
      setFarmer(JSON.parse(stored));
    } else {
      navigate('/'); // redirect if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('farmer');
    localStorage.removeItem('farmerPhone');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Agriculture-themed background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop')",
        }}
      />
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100" />
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-green-300/30 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-300/30 blur-3xl rounded-full" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <GiFarmTractor className="text-green-700 text-3xl" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">Agri Assist</h1>
            <p className="text-xs text-green-700/70">Smart tools for modern farming</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Welcome and features */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        {/* Hero */}
        <div className="mt-4 mb-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-green-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-green-800">
                👋 Welcome {farmer?.name ? farmer.name : 'Farmer'}
              </h2>
              <p className="text-green-700/80 mt-1">
                {farmer?.location ? `Location: ${farmer.location}` : 'Let’s grow smarter together'}
              </p>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const CardInner = (
              <div className="h-full p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3 text-green-700">
                  <div className="p-2 rounded-lg bg-green-50 border border-green-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-3">{feature.tagline || `Explore ${feature.name}`}</p>
              </div>
            );

            return feature.externalUrl ? (
              <a
                key={feature.name}
                href={feature.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                {CardInner}
              </a>
            ) : (
              <Link key={feature.name} to={feature.route} className="block">
                {CardInner}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
