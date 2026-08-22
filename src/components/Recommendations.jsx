import React from 'react';
import { Award, AlertCircle, Sparkles, Building, Landmark, Trees } from 'lucide-react';

export default function Recommendations({ 
  nagpurData, 
  selectedSector, 
  setSelectedSector, 
  capitalSize, 
  setCapitalSize, 
  recoLocations, 
  selectedTehsil, 
  setSelectedTehsil 
}) {

  const sectors = [
    "Agriculture & Livestock",
    "IT & Services",
    "Retail & Trade",
    "Manufacturing",
    "Food & Hospitality"
  ];

  const capitals = [
    { value: "low", label: "Low (Under ₹2 Lakhs)" },
    { value: "medium", label: "Medium (₹2 - ₹10 Lakhs)" },
    { value: "high", label: "High (Above ₹10 Lakhs)" }
  ];

  // Map sector to icon
  const getSectorIcon = (sec) => {
    switch (sec) {
      case 'IT & Services': return <Landmark className="w-4 h-4 text-cyan-400" />;
      case 'Retail & Trade': return <Building className="w-4 h-4 text-blue-400" />;
      case 'Manufacturing': return <Award className="w-4 h-4 text-indigo-400" />;
      case 'Food & Hospitality': return <Sparkles className="w-4 h-4 text-orange-400" />;
      case 'Agriculture & Livestock': return <Trees className="w-4 h-4 text-green-400" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="filter-group">
      {/* 1. Filter Section */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: '#c7d2fe' }}>
          <Sparkles className="w-5 h-5 text-indigo-400" /> Recommender Inputs
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <label className="input-label">Select Business Sector</label>
          <select 
            className="select-input" 
            value={selectedSector} 
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">Startup Capital Budget</label>
          <select 
            className="select-input" 
            value={capitalSize} 
            onChange={(e) => setCapitalSize(e.target.value)}
          >
            {capitals.map(cap => (
              <option key={cap.value} value={cap.value}>{cap.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Recommendations Output */}
      <div className="filter-group" style={{ gap: '12px' }}>
        <h3 className="panel-title" style={{ marginTop: '10px' }}>
          <Award className="w-5 h-5 text-yellow-400" /> Recommended Tehsils
        </h3>
        
        {recoLocations.length === 0 ? (
          <div className="info-alert">
            No recommendation could be generated. Try adjusting your filters.
          </div>
        ) : (
          recoLocations.map((reco, index) => {
            const isSelected = selectedTehsil === reco.tehsil;
            
            // Calculate heuristic scoring contributions for explainability breakdown
            const compScore = Math.max(15, Math.min(30, Math.round(30 - (reco.competitors * 0.8))));
            const rentScore = Math.max(10, Math.min(25, Math.round(25 - (reco.rentIndex * 2.0))));
            const resourceScore = Math.min(25, Math.max(5, Math.round(5 + (reco.resources.length * 5.0))));
            const demandScore = Math.max(10, Math.min(20, Math.round(reco.consumerDemandIndex * 0.2)));
            
            // Heuristic government schemes matcher
            let matchedSchemes = [];
            if (selectedSector === "Agriculture & Livestock") {
              matchedSchemes = [
                { name: "PMFME Scheme", desc: "35% subsidy for agro-food processing and cold storage setups." },
                { name: "Nagpur Orange Subvention", desc: "State support for orange wax plants and citrus pulping." }
              ];
            } else if (selectedSector === "Manufacturing") {
              matchedSchemes = [
                { name: "PMEGP Subsidy", desc: "Up to 35% subsidy on project capital for rural manufacturing." },
                { name: "Maharashtra PSI 2019", desc: "Electricity duty exemptions and basket tax incentives for MSMEs." }
              ];
            } else if (selectedSector === "IT & Services" || selectedSector === "Retail & Trade") {
              matchedSchemes = [
                { name: "Mudra Loan (Kishor)", desc: "Collateral-free business credit up to ₹5 Lakhs for shops." },
                { name: "Stand-Up India", desc: "Loans up to ₹1 Crore for women / SC / ST service startup founders." }
              ];
            } else {
              matchedSchemes = [
                { name: "PMFME Subsidy", desc: "Financial support for cottage bakery and micro spice milling units." },
                { name: "NABARD Agri-Tourism", desc: "Capital loans and subsidies for rural leisure resort lodging." }
              ];
            }

            return (
              <div 
                key={reco.tehsil} 
                className="reco-card"
                style={{ 
                  borderColor: isSelected ? 'var(--color-secondary)' : 'rgba(99, 102, 241, 0.15)',
                  boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none'
                }}
                onClick={() => setSelectedTehsil(reco.tehsil)}
              >
                <div className="reco-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="reco-rank" style={{ 
                      backgroundColor: index === 0 ? '#22c55e' : index === 1 ? '#06b6d4' : '#eab308' 
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="reco-title" style={{ margin: 0 }}>{reco.tehsil}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type: {reco.type}</span>
                    </div>
                  </div>
                  <div className="reco-score">
                    Score: {reco.score}%
                  </div>
                </div>

                <div style={{ fontSize: '13px', lineHeight: '1.4', color: '#cbd5e1', marginBottom: '8px' }}>
                  <strong>Rural Fit Analysis:</strong> {reco.reason}
                </div>

                {/* Score Explainability Expandable Panel */}
                <details style={{ margin: '6px 0', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ padding: '6px', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                    🔍 Score Diagnostics (Explainability)
                  </summary>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '2px' }}>
                        <span>Competition Level (Lower is Better)</span>
                        <strong>{compScore} pts</strong>
                      </div>
                      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}>
                        <div style={{ width: `${(compScore / 30) * 100}%`, height: '100%', background: '#22c55e', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '2px' }}>
                        <span>Rent Affordability (Higher is Cheaper)</span>
                        <strong>{rentScore} pts</strong>
                      </div>
                      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}>
                        <div style={{ width: `${(rentScore / 25) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                      </div>
                    </div>

                    <div style={{ fontSize: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '2px' }}>
                        <span>Raw Material Proximity</span>
                        <strong>{resourceScore} pts</strong>
                      </div>
                      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}>
                        <div style={{ width: `${(resourceScore / 25) * 100}%`, height: '100%', background: '#eab308', borderRadius: '2px' }}></div>
                      </div>
                    </div>

                    <div style={{ fontSize: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '2px' }}>
                        <span>Local Consumer Demand</span>
                        <strong>{demandScore} pts</strong>
                      </div>
                      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}>
                        <div style={{ width: `${(demandScore / 20) * 100}%`, height: '100%', background: '#ec4899', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Government Schemes Matcher */}
                <div style={{ margin: '8px 0', padding: '6px', background: 'rgba(6, 182, 212, 0.03)', border: '1px dashed rgba(6, 182, 212, 0.15)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '9px', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Matched Gov Subsidies</span>
                  {matchedSchemes.map((sch, sIdx) => (
                    <div key={sIdx} style={{ fontSize: '11px', color: '#e2e8f0', marginTop: '3px' }}>
                      <strong>{sch.name}</strong>: <span style={{ color: '#94a3b8', fontSize: '10px' }}>{sch.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="reco-meta" style={{ marginTop: '8px' }}>
                  <span className="resource-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {reco.competitors} Competitors
                  </span>
                  <span className="resource-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}>
                    Pop: {reco.population.toLocaleString()}
                  </span>
                  <span className="resource-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                    Rent: ₹{reco.avgRentPerSqft}/sqft
                  </span>
                  <span className="resource-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    Survival: {reco.survivalIndex}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  {reco.resources.map((res, idx) => (
                    <span 
                      key={idx} 
                      className={`resource-badge ${reco.type.includes('Rural') ? 'agriculture' : reco.type.includes('Industrial') ? 'industrial' : ''}`} 
                      style={{ fontSize: '9px' }}
                    >
                      {res}
                    </span>
                  ))}
                </div>

                {/* AI Feasibility Report Action Button */}
                <button
                  type="button"
                  className="btn-primary"
                  style={{ 
                    marginTop: '8px', 
                    width: '100%', 
                    padding: '8px', 
                    fontSize: '11px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGenerateReport) {
                      onGenerateReport(reco);
                    }
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" /> Generate AI Feasibility Report
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
