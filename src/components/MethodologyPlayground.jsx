import React, { useState } from 'react';
import { Sliders, Code, Search, Database, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MethodologyPlayground({ nagpurData }) {
  // 1. Formula Tuning Lab Weights (Sliders)
  const [wComp, setWComp] = useState(40);
  const [wRes, setWRes] = useState(40);
  const [wRent, setWRent] = useState(20);

  // Sector selected for simulation
  const [simSector, setSimSector] = useState('Agriculture & Livestock');
  const [simCapital, setSimCapital] = useState('medium');

  // Selected JSON Inspector source
  const [inspectorSource, setInspectorSource] = useState('udyam');

  // Compute total for normalization
  const totalWeight = wComp + wRes + wRent || 1;
  const normComp = wComp / totalWeight;
  const normRes = wRes / totalWeight;
  const normRent = wRent / totalWeight;

  // Calculate scores for all tehsils based on user sliders
  const calculateSimulatedScores = () => {
    if (!nagpurData) return [];

    const details = nagpurData.tehsil_details || {};
    const stats = nagpurData.tehsil_stats || {};

    return Object.entries(details).map(([tehName, info]) => {
      const tehStats = stats[tehName] || { count: 0, categories: {} };
      const competitors = tehStats.categories[simSector] || 0;

      // 1. Competitor Gap Score (lower competitors = higher score)
      let compScore = 100 - (competitors * 4);
      compScore = Math.max(20, Math.min(100, compScore));

      // 2. Resource Synergy Score
      let resScore = 30; // base resource synergy
      const sectorResources = {
        'Agriculture & Livestock': ['Oranges', 'Soybean', 'Paddy', 'Livestock', 'Dairy'],
        'Manufacturing': ['Cotton', 'Coal', 'Manganese', 'Steel', 'Soybean'],
        'IT & Services': ['Highways', 'Colleges', 'Schools', 'Urban'],
        'Food & Hospitality': ['Oranges', 'Highways', 'Chilli', 'Paddy'],
        'Retail & Trade': ['Highways', 'Population', 'Schools', 'Colleges']
      };

      const matchedResources = info.resources?.filter(r => 
        sectorResources[simSector]?.some(sr => r.includes(sr) || sr.includes(r))
      ) || [];
      resScore += matchedResources.length * 20;

      // Add crop/mineral weight from APMC production values if they exist
      if (info.crop_mineral_production) {
        if (simSector === 'Agriculture & Livestock' && (info.crop_mineral_production.Oranges > 10000 || info.crop_mineral_production.Soybean > 10000)) {
          resScore += 15;
        }
        if (simSector === 'Manufacturing' && info.crop_mineral_production.Cotton > 10000) {
          resScore += 15;
        }
      }
      resScore = Math.min(100, resScore);

      // 3. Budget Rent Fit Score
      let rentScore = 50;
      const rentVal = info.avg_rent_per_sqft || 15;
      if (simCapital === 'low' && rentVal < 30) rentScore = 95;
      else if (simCapital === 'medium' && rentVal >= 30 && rentVal < 70) rentScore = 95;
      else if (simCapital === 'high' && rentVal >= 70) rentScore = 95;
      else {
        // Penalty for mismatched rents
        const diff = Math.abs(rentVal - (simCapital === 'low' ? 15 : simCapital === 'medium' ? 50 : 100));
        rentScore = Math.max(30, 100 - diff);
      }

      // Aggregate using user-adjusted normalized weights
      const finalScore = Math.round(
        (compScore * normComp) + 
        (resScore * normRes) + 
        (rentScore * normRent)
      );

      return {
        name: info.name,
        finalScore: Math.min(99, Math.max(35, finalScore)),
        compScore,
        resScore,
        rentScore,
        competitors
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  };

  const simulatedTehsils = calculateSimulatedScores();

  // Mock Schemas for inspector
  const schemas = {
    udyam: {
      source: "Ministry of MSME Udyam Registration Registry",
      pipeline: "Periodic API extraction using District Filter = 'Nagpur' & State = 'Maharashtra'",
      sampleRecord: {
        "udyam_number": "UDYAM-MH-20-XXXXXXX",
        "enterprise_name": "Katol Citrus Cold Storage Pvt Ltd",
        "major_activity": "Manufacturing / Food Processing",
        "nic_2_digit_code": "10 - Manufacture of food products",
        "tehsil": "Katol",
        "pincode": 441302,
        "date_of_commencement": "2023-04-12",
        "employment_count": 8,
        "investment_level": "medium"
      }
    },
    census: {
      source: "Census of India - Nagpur Primary Census Abstract",
      pipeline: "Static extraction of population totals, household counts, literacy rates, and worker classification.",
      sampleRecord: {
        "district": "Nagpur (09)",
        "tehsil_name": "Bhiwapur",
        "total_households": 18456,
        "total_population": 84210,
        "literacy_rate": "81.4%",
        "main_agricultural_workers": 24902,
        "household_industry_workers": 1284
      }
    },
    osm: {
      source: "OpenStreetMap (OSM) via Overpass API Server",
      pipeline: "Real-time query for infrastructure nodes inside Nagpur bounding box coordinates.",
      sampleRecord: {
        "type": "way",
        "id": 43810294,
        "tags": {
          "highway": "primary",
          "name": "Nagpur-Jalalkheda Highway (SH-24)",
          "surface": "asphalt",
          "lanes": "2",
          "ref": "MH_SH_24"
        },
        "amenities_extracted": {
          "schools": 42,
          "colleges": 3,
          "hospitals": 12,
          "bus_stations": 2
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Introduction */}
      <div className="info-alert" style={{ borderLeftColor: 'var(--color-primary)' }}>
        <Sliders className="w-5 h-5" style={{ marginBottom: '6px', color: 'var(--color-primary)' }} />
        <strong>Interactive Data & Methodology Sandbox:</strong> Don't just read the methodology—test it. Adjust the weights below to see how our scoring model re-ranks Nagpur blocks, or inspect the raw data pipeline structures.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Section 1: Simulated Weights Playground */}
        <div className="section-card">
          <h3 className="panel-title" style={{ color: 'var(--color-secondary)' }}>
            <Sliders className="w-5 h-5" /> Score Calibration Controls
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Adjust the sliders below. The system will automatically recalculate and re-rank tehsils in real-time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Sim Sector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="input-label" style={{ fontSize: '11px' }}>Simulate Business Industry</label>
              <select
                className="select-input"
                value={simSector}
                onChange={(e) => setSimSector(e.target.value)}
              >
                <option value="Agriculture & Livestock">🌱 Agriculture & Food Processing</option>
                <option value="Manufacturing">🏗️ Micro-Manufacturing & Packaging</option>
                <option value="IT & Services">💻 Tech & Digital Services</option>
                <option value="Food & Hospitality">🍳 Catering & Tea Stalls</option>
                <option value="Retail & Trade">🤝 Retail Shop & Trading</option>
              </select>
            </div>

            {/* Sim Budget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="input-label" style={{ fontSize: '11px' }}>Simulate Budget Level</label>
              <select
                className="select-input"
                value={simCapital}
                onChange={(e) => setSimCapital(e.target.value)}
              >
                <option value="low">Micro (Less than ₹2 Lakhs)</option>
                <option value="medium">Small (₹2 Lakhs - ₹8 Lakhs)</option>
                <option value="high">Commercial (More than ₹8 Lakhs)</option>
              </select>
            </div>

            {/* Sliders */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Slider 1: Competitor density */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>Competitor Gap Weight</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>{wComp}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wComp}
                  onChange={(e) => setWComp(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
                />
              </div>

              {/* Slider 2: Resource Synergy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>Resource Proximity Weight</span>
                  <strong style={{ color: 'var(--color-accent-orange)' }}>{wRes}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wRes}
                  onChange={(e) => setWRes(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent-orange)', marginTop: '4px' }}
                />
              </div>

              {/* Slider 3: Rent Fitting */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>Rental Fit Weight</span>
                  <strong style={{ color: '#22c55e' }}>{wRent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wRent}
                  onChange={(e) => setWRent(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#22c55e', marginTop: '4px' }}
                />
              </div>

            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
              Formula: (CompScore × {Math.round(normComp*100)}%) + (ResScore × {Math.round(normRes*100)}%) + (RentScore × {Math.round(normRent*100)}%)
            </div>

          </div>
        </div>

        {/* Section 2: Real-time Re-ranking Output */}
        <div className="section-card">
          <h3 className="panel-title" style={{ color: '#fff' }}>
            🏆 Simulated Suitability Rankings
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Calculated rankings for all Nagpur blocks based on your sliders.
          </p>

          <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {simulatedTehsils.map((item, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px',
                  display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid rgba(255,255,255,0.04)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                    {idx + 1}. {item.name}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                    {item.finalScore}% Match
                  </span>
                </div>
                
                {/* Score bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.finalScore}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)', borderRadius: '2px' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '8px', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>Comp Gap: <strong style={{ color: '#fff' }}>{Math.round(item.compScore)}</strong></span>
                  <span>Resources: <strong style={{ color: '#fff' }}>{Math.round(item.resScore)}</strong></span>
                  <span>Rent Fit: <strong style={{ color: '#fff' }}>{Math.round(item.rentScore)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 3: Interactive JSON Data Pipeline Inspector */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <h3 className="panel-title" style={{ margin: 0, color: 'var(--color-secondary)' }}>
              <Database className="w-5 h-5" /> Data Pipeline Schema Inspector
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Select an API source to inspect record structures from our Nagpur database.</p>
          </div>

          {/* Toggle buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`nav-tab ${inspectorSource === 'udyam' ? 'active' : ''}`}
              style={{ margin: 0, padding: '4px 12px', fontSize: '11px' }}
              onClick={() => setInspectorSource('udyam')}
            >
              Udyam API Registry
            </button>
            <button
              type="button"
              className={`nav-tab ${inspectorSource === 'census' ? 'active' : ''}`}
              style={{ margin: 0, padding: '4px 12px', fontSize: '11px' }}
              onClick={() => setInspectorSource('census')}
            >
              Census PCA data
            </button>
            <button
              type="button"
              className={`nav-tab ${inspectorSource === 'osm' ? 'active' : ''}`}
              style={{ margin: 0, padding: '4px 12px', fontSize: '11px' }}
              onClick={() => setInspectorSource('osm')}
            >
              OpenStreetMap API
            </button>
          </div>
        </div>

        {/* Console view */}
        <div style={{ 
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px',
          fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8', overflowX: 'auto' 
        }}>
          <div style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '10px' }}>
            <strong>Registry Name:</strong> {schemas[inspectorSource].source}
            <br />
            <strong>Pipeline Method:</strong> {schemas[inspectorSource].pipeline}
          </div>
          
          <pre style={{ margin: 0, color: '#f1f5f9' }}>
            {JSON.stringify(schemas[inspectorSource].sampleRecord, null, 2)}
          </pre>
        </div>
      </div>

    </div>
  );
}
