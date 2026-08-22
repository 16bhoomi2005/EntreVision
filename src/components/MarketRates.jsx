import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, RefreshCw, Info } from 'lucide-react';
import mandiRates from '../data/mandi_rates.json';

export default function MarketRates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('All');

  // Extract unique Mandis
  const mandis = ['All', ...new Set(mandiRates.map(item => item.mandi))];

  const filteredRates = mandiRates.filter(item => {
    const matchesSearch = item.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMandi = selectedMandi === 'All' || item.mandi === selectedMandi;
    return matchesSearch && matchesMandi;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Informative Top Alert */}
      <div className="info-alert" style={{ borderLeftColor: '#22c55e' }}>
        <Info className="w-5 h-5 text-green-400" style={{ marginBottom: '6px' }} />
        <strong>Daily Crop Mandi Prices:</strong> Mapped using local Nagpur wholesale APMC market returns. Real-time rates help you project revenues and calculate raw-material buy margins.
      </div>

      {/* Filter and Search controls */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: '#fff' }}>
          🔍 Search Commodity Prices
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
          {/* Keyword Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Search Commodity</label>
            <div style={{ position: 'relative' }}>
              <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="text-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Oranges, Cotton..."
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Mandi select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Filter by Mandi Market</label>
            <select
              className="select-input"
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
            >
              {mandis.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
        {filteredRates.length === 0 ? (
          <div className="info-alert" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No commodities match your filter criteria. Reset the filters above.
          </div>
        ) : (
          filteredRates.map((rate, index) => (
            <div 
              key={index} 
              className="reco-card" 
              style={{ 
                padding: '20px', 
                background: 'rgba(30, 41, 59, 0.4)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px', 
                borderLeft: '4px solid rgba(255,255,255,0.06)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>
                    {rate.commodity}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Market: {rate.mandi}</span>
                </div>
                
                {/* Trend badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rate.trend === 'up' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      <TrendingUp className="w-3 h-3" /> Upward
                    </span>
                  ) : rate.trend === 'down' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      <TrendingDown className="w-3 h-3" /> Downward
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: '#eab308', background: 'rgba(234, 179, 8, 0.12)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      <RefreshCw className="w-3 h-3" /> Stable
                    </span>
                  )}
                </div>
              </div>

              {/* Price details */}
              <div style={{ 
                background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', 
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'center' 
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Typical Wholesale Rate</span>
                  <div style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
                    {rate.model_price} <span style={{ fontSize: '10px', fontWeight: 'normal' }}>{rate.unit}</span>
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Daily Price Range</span>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px', fontWeight: '500' }}>
                    ₹{rate.min_price} - ₹{rate.max_price}
                  </div>
                </div>
              </div>

              {/* Update Info footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '10px', color: 'var(--text-muted)' }}>
                Last Report: {rate.last_updated}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
