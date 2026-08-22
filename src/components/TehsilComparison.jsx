import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Check, X, ShieldAlert, Award, CircleDot } from 'lucide-react';

export default function TehsilComparison({ nagpurData }) {
  if (!nagpurData) return <div style={{ color: '#fff' }}>Loading datasets...</div>;

  const tehsilsList = Object.keys(nagpurData.tehsil_details || {});

  const [compareList, setCompareList] = useState([
    tehsilsList[0] || '',
    tehsilsList[1] || '',
    tehsilsList[2] || ''
  ]);

  const handleSelectTehsil = (index, val) => {
    const updated = [...compareList];
    updated[index] = val;
    setCompareList(updated);
  };

  const getComparisonData = () => {
    return compareList.map(name => {
      if (!name || !nagpurData.tehsil_details[name]) return null;
      return {
        name,
        details: nagpurData.tehsil_details[name],
        stats: nagpurData.tehsil_stats[name] || { count: 0 }
      };
    }).filter(Boolean);
  };

  const activeCompare = getComparisonData();

  const getChartData = () => {
    const labels = ['Consumer Demand', 'Purchasing Power', 'Mobility/Footfall', 'Business Survival %'];
    
    // Pick 3 high-contrast theme colors for comparison series
    const colors = [
      'rgba(99, 102, 241, 0.85)', // Indigo
      'rgba(6, 182, 212, 0.85)',  // Cyan
      'rgba(245, 158, 11, 0.85)'   // Orange
    ];

    const datasets = activeCompare.map((item, idx) => {
      const data = [
        item.details.consumer_demand_index || 0,
        item.details.purchasing_power_index || 0,
        item.details.mobility_index || 0,
        item.details.survival_index || 0
      ];
      return {
        label: item.name,
        data: data,
        backgroundColor: colors[idx],
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1
      };
    });

    return {
      labels,
      datasets
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      {/* Selector Panels */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: 'var(--color-secondary)' }}>
          <Award className="w-5 h-5" /> Compare Nagpur Tehsils (Side-by-Side)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Select up to 3 tehsils to run comparative diagnostics on infrastructure, real estate rents, consumer demand, and business survival rates.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {[0, 1, 2].map(idx => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="input-label" style={{ fontSize: '11px' }}>Tehsil Selection #{idx + 1}</label>
              <select
                className="select-input"
                value={compareList[idx] || ''}
                onChange={(e) => handleSelectTehsil(idx, e.target.value)}
              >
                <option value="">-- Choose Tehsil --</option>
                {tehsilsList.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {activeCompare.length === 0 ? (
        <div className="info-alert">Please select at least one tehsil from the dropdowns above.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          {/* Comparison Table Card */}
          <div className="section-card" style={{ overflowX: 'auto' }}>
            <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '16px' }}>
              📊 Core Statistics Grid
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '8px 4px' }}>Parameter</th>
                  {activeCompare.map((item, i) => (
                    <th key={i} style={{ padding: '8px 4px', color: 'var(--color-secondary)' }}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Zone Type (Urban / Rural)</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.type}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Total Population</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.population.toLocaleString()}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Avg Rent Cost (per sq.ft.)</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px', color: '#f59e0b' }}>₹{item.details.avg_rent_per_sqft}/sqft</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Available Land Space</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px', color: '#10b981' }}>{item.details.land_availability}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Active Registered Businesses</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.stats.count}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Primary & High Schools</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.schools}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Colleges & Higher Ed</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.colleges}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Clinics & Hospitals</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.hospitals}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>Bus & Railway Stations</td>
                  {activeCompare.map((item, i) => (
                    <td key={i} style={{ padding: '8px 4px' }}>{item.details.transport}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grouped Bar Chart Comparison */}
          <div className="section-card" style={{ minHeight: '350px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '16px' }}>
              📊 Index Performance Analysis
            </h4>
            <div style={{ height: '280px' }}>
              <Bar
                data={getChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: { color: '#94a3b8', font: { size: 10 } }
                    }
                  },
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                  }
                }}
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
