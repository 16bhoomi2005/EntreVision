import React, { useState, useEffect } from 'react';
import { Sliders, HelpCircle, TrendingUp, DollarSign, Award, Percent, AlertTriangle, Plus, Trash2, ArrowRight } from 'lucide-react';
import businessArchetypes from '../data/business_archetypes.json';

export default function ScenarioSimulator() {
  const defaultValues = {
    orange_pulp: { price: 150, varCost: 75, volume: 1500, wages: 25000, setup: 355000, rent: 15000 },
    fly_ash_bricks: { price: 12, varCost: 6, volume: 30000, wages: 80000, setup: 905000, rent: 45000 },
    cotton_roll: { price: 80, varCost: 40, volume: 4000, wages: 35000, setup: 515000, rent: 20000 },
    cold_pressed_oil: { price: 180, varCost: 90, volume: 1200, wages: 20000, setup: 260000, rent: 12000 },
    spices_grinding: { price: 100, varCost: 50, volume: 1000, wages: 12000, setup: 98000, rent: 6000 },
    dairy_farm: { price: 60, varCost: 28, volume: 8000, wages: 40000, setup: 775000, rent: 25000 },
    e_seva_kendra: { price: 80, varCost: 15, volume: 600, wages: 8000, setup: 81000, rent: 4000 },
    soil_testing_lab: { price: 350, varCost: 120, volume: 300, wages: 18000, setup: 242000, rent: 8000 },
    tractor_repair: { price: 1200, varCost: 450, volume: 100, wages: 25000, setup: 220000, rent: 15000 },
    agro_tourism: { price: 2500, varCost: 1000, volume: 120, wages: 50000, setup: 1050000, rent: 0 },
    micro_bakery: { price: 40, varCost: 20, volume: 8000, wages: 30000, setup: 282000, rent: 12000 },
    fertilizer_retail: { price: 450, varCost: 380, volume: 400, wages: 15000, setup: 75000, rent: 10000 },
    solar_pump_dealership: { price: 45000, varCost: 38000, volume: 12, wages: 30000, setup: 390000, rent: 20000 },
    general_store: { price: 250, varCost: 200, volume: 600, wages: 8000, setup: 46000, rent: 6000 },
    poultry_farm: { price: 120, varCost: 70, volume: 1200, wages: 15000, setup: 190000, rent: 8000 }
  };

  const [selectedBizId, setSelectedBizId] = useState(businessArchetypes[0].id);

  // Sliders State
  const [rent, setRent] = useState(15000);
  const [setup, setSetup] = useState(355000);
  const [price, setPrice] = useState(150);
  const [varCost, setVarCost] = useState(75);
  const [volume, setVolume] = useState(1500);
  const [wages, setWages] = useState(25000);

  // Memory & Scenarios
  const [baseline, setBaseline] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [newScenarioName, setNewScenarioName] = useState('');

  // Sync sliders when selecting a different business
  useEffect(() => {
    const defaults = defaultValues[selectedBizId];
    if (defaults) {
      setRent(defaults.rent);
      setSetup(defaults.setup);
      setPrice(defaults.price);
      setVarCost(defaults.varCost);
      setVolume(defaults.volume);
      setWages(defaults.wages);
      
      // Update baseline memory on biz change
      setBaseline({
        setup: defaults.setup,
        rent: defaults.rent,
        wages: defaults.wages,
        price: defaults.price,
        varCost: defaults.varCost,
        volume: defaults.volume,
        netProfit: (defaults.price * defaults.volume) - (defaults.rent + defaults.wages + 5000 + (defaults.varCost * defaults.volume)),
        roiMonths: defaults.netProfit > 0 ? (defaults.setup / defaults.netProfit).toFixed(1) : 'Infinite'
      });
    }
  }, [selectedBizId]);

  // Formulas
  const revenue = price * volume;
  const fixedCost = rent + wages + 5000; // 5000 is utility baseline
  const variableCost = varCost * volume;
  const totalCost = fixedCost + variableCost;
  const netProfit = revenue - totalCost;

  const contributionMargin = price - varCost;
  const breakEvenVolume = contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : 999999;
  
  const roiVal = netProfit > 0 ? (setup / netProfit).toFixed(1) : '99';
  const roiMonths = netProfit > 0 ? parseFloat(roiVal) : 99;

  // Set current as baseline
  const handleSetBaseline = () => {
    setBaseline({ setup, rent, wages, price, varCost, volume, netProfit, roiMonths });
  };

  // Save current scenario
  const handleSaveScenario = (e) => {
    e.preventDefault();
    if (!newScenarioName.trim()) return;
    setSavedScenarios([
      ...savedScenarios,
      {
        id: Date.now(),
        name: newScenarioName,
        bizName: businessArchetypes.find(b => b.id === selectedBizId)?.name || 'Custom',
        setup, rent, wages, price, varCost, volume, netProfit, roiMonths
      }
    ]);
    setNewScenarioName('');
  };

  const handleDeleteScenario = (id) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
  };

  // Sensitivity Ranking calculations (Priority 2)
  const getSensitivityRanking = () => {
    const calcProfit = (p, v, vc, r, w) => {
      const rev = p * v;
      const fc = r + w + 5000;
      const vcTot = vc * v;
      return rev - (fc + vcTot);
    };

    const swingPrice = calcProfit(price * 1.1, volume, varCost, rent, wages) - netProfit;
    const swingVolume = calcProfit(price, volume * 1.1, varCost, rent, wages) - netProfit;
    const swingVarCost = calcProfit(price, volume, varCost * 1.1, rent, wages) - netProfit;
    const swingRent = calcProfit(price, volume, varCost, rent * 1.1, wages) - netProfit;
    const swingWages = calcProfit(price, volume, varCost, rent, wages * 1.1) - netProfit;

    const factors = [
      { label: "Product Retail Price", swing: Math.abs(swingPrice), dir: swingPrice > 0 ? "positive" : "negative" },
      { label: "Expected Sales Volume", swing: Math.abs(swingVolume), dir: swingVolume > 0 ? "positive" : "negative" },
      { label: "Raw Material (Variable) Cost", swing: Math.abs(swingVarCost), dir: swingVarCost > 0 ? "positive" : "negative" },
      { label: "Monthly Lease Rent", swing: Math.abs(swingRent), dir: swingRent > 0 ? "positive" : "negative" },
      { label: "Staff Salaries", swing: Math.abs(swingWages), dir: swingWages > 0 ? "positive" : "negative" }
    ];

    return factors.sort((a, b) => b.swing - a.swing);
  };

  const sensitivities = getSensitivityRanking();
  const topLever = sensitivities[0];

  // Narrative summary auto-generator (Priority 1)
  const getNarrativeSummary = () => {
    if (netProfit <= 0) {
      return `⚠ In this configuration, the business is operating at a loss. Your total operating overhead (fixed costs at ₹${fixedCost.toLocaleString()}/mo) exceeds your unit margins. To fix this, you must increase your selling price or scale up monthly sales volume above ${breakEvenVolume.toLocaleString()} units.`;
    }
    
    const safetyMargin = Math.round(((volume - breakEvenVolume) / volume) * 100);
    const riskNote = safetyMargin < 20 
      ? "Your margin of safety is extremely narrow. A small drop in daily customers or raw material price spike will push you into loss."
      : "You have a comfortable safety margin to absorb market price changes.";
      
    return `💡 At current settings, this business is profitable, generating ₹${netProfit.toLocaleString()} net profit monthly with a payback period of ${roiMonths === 99 ? 'Infinite' : roiMonths} months. Your profit is most sensitive to changes in ${topLever.label}. ${riskNote}`;
  };

  // Risk warning alerts (Priority 3)
  const getRiskFlags = () => {
    let flags = [];
    // Margin of safety check
    if (netProfit > 0) {
      const margin = (volume - breakEvenVolume) / volume;
      if (margin < 0.15) {
        flags.push("High Price Sensitivity: A 15% drop in selling price wipes out all profits and creates a loss.");
      }
    }
    // High volume check
    if (volume > 5000 && selectedBizId !== 'fly_ash_bricks') {
      flags.push(`Ambitious Sales Target: Selling ${volume.toLocaleString()} units/mo is highly challenging for rural blocks. Cross-verify this with nearby tehsil demand.`);
    }
    // Setup cost runway check
    if (setup > 500000 && rent > 25000) {
      flags.push("Heavy Capital Exposure: Your high rent + setup requirements demand at least 6 months of cash buffer.");
    }
    return flags;
  };

  const riskFlags = getRiskFlags();

  // Context Comparators (Priority 4)
  const getContextNote = () => {
    const averageRuralIncome = 22500; // Nagpur rural avg household income
    const diff = Math.abs(netProfit - averageRuralIncome);
    if (netProfit > averageRuralIncome) {
      return `✔ This profit is ₹${diff.toLocaleString()} above the average household income in Nagpur rural tehsils (₹22,500/mo).`;
    } else {
      return `ℹ This profit is ₹${diff.toLocaleString()} below the average rural Nagpur household average. Adjust sliders to optimize your setup.`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header Alert */}
      <div className="info-alert" style={{ borderLeftColor: '#6366f1' }}>
        <Sliders className="w-5 h-5 text-indigo-400" style={{ marginBottom: '6px' }} />
        <strong>What-If Scenario Simulator:</strong> Slide inputs to simulate different cost scales (e.g. cheap shed vs proper shop) and discover which levers affect your bottom line the most.
      </div>

      {/* 2. Narrative summary block (Priority 1) */}
      <div className="info-alert" style={{ background: 'rgba(99, 102, 241, 0.05)', borderLeftColor: 'var(--color-secondary)' }}>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#e2e8f0', fontStyle: 'italic' }}>
          {getNarrativeSummary()}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Sliders Input Panel */}
        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label className="input-label" style={{ fontSize: '11px' }}>Select Business Archetype</label>
            <select
              className="select-input"
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              style={{ margin: 0 }}
            >
              {businessArchetypes.map((biz) => (
                <option key={biz.id} value={biz.id}>{biz.name}</option>
              ))}
            </select>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Initial Setup Cost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Initial Setup Cost (₹)</span>
                <strong style={{ color: '#fff' }}>₹{setup.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="5000"
                value={setup}
                onChange={(e) => setSetup(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

            {/* Monthly Rent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Monthly Lease Rent (₹/month)</span>
                <strong style={{ color: '#fff' }}>₹{rent.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="1000"
                value={rent}
                onChange={(e) => setRent(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

            {/* Labor Wages */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Staff Wages & Salaries (₹/month)</span>
                <strong style={{ color: '#fff' }}>₹{wages.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={wages}
                onChange={(e) => setWages(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

            {/* Selling Price */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Selling Price per Unit (₹)</span>
                <strong style={{ color: '#fff' }}>₹{price.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="1"
                max={selectedBizId === 'solar_pump_dealership' ? 100000 : 5000}
                step="1"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

            {/* Unit Variable Cost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Unit Variable Cost (₹)</span>
                <strong style={{ color: '#fff' }}>₹{varCost.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="0"
                max={price - 1 > 0 ? price - 1 : 1}
                step="1"
                value={varCost}
                onChange={(e) => setVarCost(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

            {/* Expected Volume */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                <span>Expected Monthly Volume</span>
                <strong style={{ color: '#fff' }}>{volume.toLocaleString()} units</strong>
              </div>
              <input
                type="range"
                min="1"
                max={selectedBizId === 'solar_pump_dealership' ? 50 : 50000}
                step="1"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)', marginTop: '4px' }}
              />
            </div>

          </div>
        </div>

        {/* Results Forecast Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="panel-title" style={{ color: '#fff', margin: 0 }}>📊 Financial Forecasts</h3>
              <button 
                type="button"
                className="nav-tab"
                style={{ fontSize: '10px', padding: '4px 8px', margin: 0 }}
                onClick={handleSetBaseline}
              >
                Set as Baseline
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Estimated profit card */}
              <div style={{ 
                background: netProfit > 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
                padding: '12px', borderRadius: '8px', 
                border: netProfit > 0 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)' 
              }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>NET PROFIT / MONTH</span>
                <div style={{ fontSize: '18px', color: netProfit > 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
                  ₹{netProfit.toLocaleString()}
                </div>
                {baseline && (
                  <span style={{ fontSize: '9px', color: netProfit - baseline.netProfit >= 0 ? '#22c55e' : '#ef4444', display: 'block', marginTop: '2px' }}>
                    {netProfit - baseline.netProfit >= 0 ? '↑' : '↓'} ₹{Math.abs(netProfit - baseline.netProfit).toLocaleString()} vs baseline
                  </span>
                )}
              </div>

              {/* Payback period card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>PAYBACK TIMELINE</span>
                <div style={{ fontSize: '18px', color: '#06b6d4', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
                  {roiMonths === 99 ? 'Infinite' : `${roiMonths} mo`}
                </div>
                {baseline && (
                  <span style={{ fontSize: '9px', color: roiMonths - baseline.roiMonths <= 0 ? '#22c55e' : '#ef4444', display: 'block', marginTop: '2px' }}>
                    {roiMonths - baseline.roiMonths <= 0 ? '↓' : '↑'} {Math.abs(roiMonths - baseline.roiMonths).toFixed(1)} months vs baseline
                  </span>
                )}
              </div>

              {/* Break-even volume card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>BREAK-EVEN TARGET</span>
                <div style={{ fontSize: '16px', color: '#eab308', fontWeight: 'bold' }}>
                  {breakEvenVolume.toLocaleString()} units <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>needed per month</span>
                </div>
              </div>
            </div>

            {/* Context Comparator Note (Priority 4) */}
            <div style={{ fontSize: '11px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
              {getContextNote()}
            </div>
          </div>

          {/* 3. Sensitivity Lever Ranking list (Priority 2) */}
          <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
              ⚡ Sensitivity: What affects your profit most?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
              {sensitivities.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <span>{idx + 1}. {s.label}</span>
                  <span style={{ fontWeight: 'bold', color: idx === 0 ? '#ef4444' : idx === 1 ? '#eab308' : '#94a3b8' }}>
                    {idx === 0 ? 'High Impact' : idx === 1 ? 'Medium Impact' : 'Low Impact'} (₹{Math.round(s.swing).toLocaleString()} shift)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Risk / Safety warning boxes (Priority 3) */}
          {riskFlags.length > 0 && (
            <div className="section-card" style={{ borderLeft: '4px solid #ef4444', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle className="w-4 h-4" /> SCENARIO RISK FLAGS:
              </span>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {riskFlags.map((flag, idx) => <li key={idx}>{flag}</li>)}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* 5. Scenario comparison A vs B drawer (Priority 4) */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📂 Saved Scenarios Comparison (Shed vs Storefront)
        </h3>

        <form onSubmit={handleSaveScenario} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input 
            type="text" 
            className="text-input" 
            placeholder="e.g. Option A: Low-rent Shed setup"
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            style={{ flex: 1, margin: 0 }}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus className="w-4 h-4" /> Save Current
          </button>
        </form>

        {savedScenarios.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '10px 0' }}>
            No saved scenarios yet. Type a name above to save and compare setups side by side.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {savedScenarios.map((sc) => (
              <div key={sc.id} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                <button
                  type="button"
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  onClick={() => handleDeleteScenario(sc.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <strong style={{ color: '#fff', fontSize: '13px', display: 'block', marginBottom: '2px' }}>{sc.name}</strong>
                <span style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>{sc.bizName}</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Capital Setup:</span>
                    <strong>₹{sc.setup.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monthly Rent:</span>
                    <strong>₹{sc.rent.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sales Volume:</span>
                    <strong>{sc.volume.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '4px', color: '#22c55e', fontWeight: 'bold' }}>
                    <span>Net Profit/mo:</span>
                    <span>₹{sc.netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
