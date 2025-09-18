import React from 'react';
import { Link } from 'react-router-dom';

const GOV_URL = 'https://www.myscheme.gov.in/search/category/Agriculture%2CRural%20%26%20Environment';

const GovernmentSchemesPage = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <div className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-800">Government Schemes (myScheme)</h1>
        <div className="flex items-center gap-3">
          <a
            href={GOV_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-green-700 underline"
            title="Open in a new tab if the site blocks embedding"
          >
            Open in new tab
          </a>
          <Link to="/dashboard" className="text-sm text-green-700 underline">Back to Dashboard</Link>
        </div>
      </div>

      <div className="flex-1">
        {/* Some sites block embedding via X-Frame-Options or CSP. We provide a fallback link above. */}
        <iframe
          title="myScheme - Agriculture, Rural & Environment"
          src={GOV_URL}
          className="w-full h-[calc(100vh-64px)] border-0"
          allow="clipboard-read; clipboard-write; fullscreen"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
};

export default GovernmentSchemesPage;
