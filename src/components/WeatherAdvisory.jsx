import React, { useState } from 'react';
import { CloudSun, Info, Wind, Droplets, Compass } from 'lucide-react';
import weatherAdvisories from '../data/weather_advisories.json';

export default function WeatherAdvisory() {
  const [selectedTehsil, setSelectedTehsil] = useState('Katol');

  const tehsils = Object.keys(weatherAdvisories);
  const currentData = weatherAdvisories[selectedTehsil] || {
    temp: "--°C",
    humidity: "--%",
    condition: "Sunny",
    advisory: "No specific advisory available."
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '650px', margin: '0 auto' }}>
      
      {/* 1. Top Informational Header */}
      <div className="info-alert" style={{ borderLeftColor: '#f59e0b' }}>
        <CloudSun className="w-5 h-5 text-amber-400" style={{ marginBottom: '6px' }} />
        <strong>Weather & Season Advisory:</strong> Integrated directly with Nagpur block level agronomical reports. Sowing and crop health practices update automatically based on weather indicators.
      </div>

      {/* 2. Selector and detail card */}
      <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Agronomy & Sowing Advisories</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select your Taluka (Tehsil) below:</span>
          </div>
          
          <select
            className="select-input"
            value={selectedTehsil}
            onChange={(e) => setSelectedTehsil(e.target.value)}
            style={{ width: '180px', margin: 0 }}
          >
            {tehsils.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Dashboard Display */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', 
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Header Metrics */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
            <div>
              <span className="resource-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-secondary)' }}>
                {selectedTehsil} Block Weather
              </span>
              <h2 style={{ fontSize: '32px', color: '#fff', margin: '4px 0 0 0', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentData.temp} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'normal' }}>{currentData.condition}</span>
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HUMIDITY</span>
                <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> {currentData.humidity}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '15px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>WIND SPEED</span>
                <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                  <Wind className="w-3.5 h-3.5 text-blue-400" /> 12 km/h
                </span>
              </div>
            </div>
          </div>

          {/* Sowing Advice text box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info className="w-3.5 h-3.5" /> OFFICIAL CROP ADVISORY FOR THIS SEASON:
            </span>
            <p style={{ margin: 0, fontSize: '14px', color: '#f1f5f9', lineHeight: '1.6' }}>
              {currentData.advisory}
            </p>
          </div>

          {/* Sowing cycle tag */}
          <div style={{ 
            display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', 
            borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', marginTop: '4px' 
          }}>
            <span>Current Sowing Cycle: <strong style={{ color: '#fff' }}>Kharif Crops (Soybean, Cotton, Paddy)</strong></span>
          </div>

        </div>
      </div>

    </div>
  );
}
