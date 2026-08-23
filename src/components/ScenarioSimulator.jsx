import React, { useState, useEffect } from 'react';
import { Sliders, HelpCircle, TrendingUp, DollarSign, Award, Percent } from 'lucide-react';
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
    }
  }, [selectedBizId]);

  // Calculations
  const revenue = price * volume;
  const fixedCost = rent + wages + 5000; // adding 5000 for basic power/water utility
  const variableCost = varCost * volume;
  const totalCost = fixedCost + variableCost;
  const netProfit = revenue - totalCost;

  const contributionMargin = price - varCost;
  const breakEvenVolume = contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : 999999;
  const roiMonths = netProfit > 0 ? (setup / netProfit).toFixed(1) : 'Infinite';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Informative top pitch */}
      <div className="info-alert" style={{ borderLeftColor: '#22c55e' }}>
        <DollarSign className="w-5 h-5 text-green-400" style={{ marginBottom: '6px' }} />
        <strong>What-If Scenario Simulator:</strong> Don't rely on generic profit projections. Select a business archetype below, adjust the operational parameters using the sliders, and see how lease rents, product pricing, and sales volumes affect your monthly profit, break-even limits, and investment payback schedule.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
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
                <span>Expected Monthly Transactions / Volume</span>
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

        {/* Results Panel */}
        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 className="panel-title" style={{ color: '#fff', margin: 0 }}>📊 Financial Output Forecasts</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            {/* Revenue */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ESTIMATED MONTHLY REVENUE</span>
              <div style={{ fontSize: '18px', color: '#6366f1', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
                ₹{revenue.toLocaleString()}
              </div>
            </div>

            {/* Operating Profit */}
            <div style={{ 
              background: netProfit > 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
              padding: '12px', borderRadius: '8px', 
              border: netProfit > 0 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)' 
            }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ESTIMATED NET PROFIT / MONTH</span>
              <div style={{ 
                fontSize: '18px', 
                color: netProfit > 0 ? '#22c55e' : '#ef4444', 
                fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', marginTop: '2px' 
              }}>
                ₹{netProfit.toLocaleString()}
              </div>
            </div>

            {/* Break-Even Units */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BREAK-EVEN VOLUME</span>
              <div style={{ fontSize: '18px', color: '#eab308', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
                {breakEvenVolume.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 'normal', color: 'var(--text-muted)' }}>units</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                Current volume: {volume.toLocaleString()}
              </span>
            </div>

            {/* Payback timeline */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PAYBACK TIMELINE (ROI)</span>
              <div style={{ fontSize: '18px', color: '#06b6d4', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
                {roiMonths} <span style={{ fontSize: '10px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Months</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                To recover setup of ₹{setup.toLocaleString()}
              </span>
            </div>

          </div>

          {/* Break-even progress gauge */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
              <span>Volume vs Break-Even Target</span>
              <span>{Math.round((volume / breakEvenVolume) * 100)}%</span>
            </div>
            
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(100, Math.round((volume / breakEvenVolume) * 100))}%`, 
                height: '100%', 
                background: volume >= breakEvenVolume ? 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)' : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
              }}></div>
            </div>

            <span style={{ fontSize: '10px', color: volume >= breakEvenVolume ? '#22c55e' : '#ef4444', fontStyle: 'italic', marginTop: '2px' }}>
              {volume >= breakEvenVolume 
                ? '✔ Operating above Break-Even. Your business is profitable.'
                : '⚠ Operating below Break-Even. Increase sales or reduce operating overhead.'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
