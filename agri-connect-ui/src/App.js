import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import MarketPricesPage from './pages/MarketPricesPage';
import MarketplaceListPage from './pages/MarketplaceListPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import EditListingPage from './pages/EditListingPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import QuickTipsPage from './pages/QuickTipsPage';
import AskAIPage from './pages/AskAIPage';
import GovernmentSchemesPage from './pages/GovernmentSchemesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/marketplace" element={<MarketplaceListPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/listing/:id/edit" element={<EditListingPage />} />
        <Route path="/advisory" element={<CropAdvisoryPage />} />
        <Route path="/quick-tips" element={<QuickTipsPage />} />
        <Route path="/ask-ai" element={<AskAIPage />} />
        <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
