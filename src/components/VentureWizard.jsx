import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Landmark, Shield, HelpCircle, Layers } from 'lucide-react';
import businessArchetypes from '../data/business_archetypes.json';

export default function VentureWizard({ onSelectBusiness }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    sector: 'Any',
    capital: 'medium',
    space: 'medium',
    risk: 'medium',
    strength: 'Trading',
    tehsil: 'Katol',
    customerReach: 'Local Mandi',
    motivation: 'Waste Synergy'
  });
  const [results, setResults] = useState([]);

  const handleSelectOption = (field, val) => {
    setAnswers({ ...answers, [field]: val });
  };

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      calculateMatches();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateMatches = () => {
    // Suitability calculations using multi-criteria classification model
    const scoredList = businessArchetypes.map(archetype => {
      let score = 40; // Starting baseline

      // 1. Sector Alignment
      if (answers.sector === 'Any' || archetype.sector === answers.sector) {
        score += 15;
      }

      // 2. Capital Budget Alignment
      if (archetype.capital === answers.capital) {
        score += 15;
      } else if (
        (answers.capital === 'high' && archetype.capital === 'medium') ||
        (answers.capital === 'medium' && archetype.capital === 'low')
      ) {
        score += 8; // Partial fit
      }

      // 3. Space Allocation Alignment
      if (archetype.space === answers.space) {
        score += 10;
      } else if (
        (answers.space === 'large' && archetype.space === 'medium') ||
        (answers.space === 'medium' && archetype.space === 'small')
      ) {
        score += 5;
      }

      // 4. Risk Profile Alignment
      if (archetype.risk === answers.risk) {
        score += 5;
      } else {
        score -= 2;
      }

      // 5. Strength / Skills Synergy Heuristics
      const sectorSkills = {
        'Agriculture & Livestock': 'Agriculture',
        'Manufacturing': 'Production/Labor',
        'IT & Services': 'Tech/Digital',
        'Food & Hospitality': 'Food/Cooking',
        'Retail & Trade': 'Trading'
      };
      if (sectorSkills[archetype.sector] === answers.strength) {
        score += 10;
      }

      // 6. Block-Level Agronomy/Resource Synergy (DSER Nagpur Statistics)
      const selectedBlock = answers.tehsil;
      if (archetype.id === 'orange_pulp') {
        if (['Katol', 'Narkhed', 'Savner', 'Kalmeshwar'].includes(selectedBlock)) {
          score += 25; // Massive citrus belt match
        }
      } else if (archetype.id === 'cold_pressed_oil') {
        if (['Kuhi', 'Mauda', 'Umred', 'Hingna'].includes(selectedBlock)) {
          score += 25; // Large soybean yield fields
        }
      } else if (archetype.id === 'cotton_roll') {
        if (['Narkhed', 'Savner', 'Katol', 'Kalmeshwar'].includes(selectedBlock)) {
          score += 25; // Black cotton soil cropping
        }
      } else if (archetype.id === 'spices_grinding') {
        if (selectedBlock === 'Bhiwapur') {
          score += 35; // Bhiwapur famous red chillies
        } else if (['Umred', 'Kuhi'].includes(selectedBlock)) {
          score += 20;
        }
      } else if (archetype.sector === 'Agriculture & Livestock') {
        if (['Ramtek', 'Parseoni', 'Kamptee'].includes(selectedBlock)) {
          score += 15; // Water rich / livestock zones
        }
      } else if (archetype.id === 'fly_ash_bricks') {
        if (['Kamptee', 'Mauda', 'Savner'].includes(selectedBlock)) {
          score += 25; // Fly ash proximity to power plants/mines
        }
      }

      // 7. Customer Reach Alignment
      const distributionChannels = {
        'Local Mandi': ['Agriculture & Livestock', 'Manufacturing'],
        'Weekly Haat / Bazaar': ['Retail & Trade', 'Food & Hospitality'],
        'Urban Wholesalers': ['Manufacturing', 'Agriculture & Livestock'],
        'Urban Retail / Digital': ['IT & Services', 'Food & Hospitality', 'Retail & Trade']
      };
      const matchingChannels = distributionChannels[answers.customerReach] || [];
      if (matchingChannels.includes(archetype.sector)) {
        score += 10;
      }

      // 8. Motivation Alignment
      const motivations = {
        'Daily Cash Flow': ['Retail & Trade', 'Food & Hospitality'],
        'Long-term Family Employment': ['Agriculture & Livestock', 'Retail & Trade'],
        'Waste Synergy': ['Manufacturing', 'Agriculture & Livestock'],
        'Export Oriented': ['Manufacturing']
      };
      const matchingMotivations = motivations[answers.motivation] || [];
      if (matchingMotivations.includes(archetype.sector)) {
        score += 10;
      }

      // Cap score between 35% and 99%
      const finalPercent = Math.max(35, Math.min(99, score));

      return {
        ...archetype,
        matchPercent: finalPercent
      };
    });

    // Sort descending by match percentage
    const sorted = scoredList.sort((a, b) => b.matchPercent - a.matchPercent);
    setResults(sorted);
    setStep(9); // Move to results view
  };

  const resetWizard = () => {
    setStep(1);
    setResults([]);
    setAnswers({
      sector: 'Any',
      capital: 'medium',
      space: 'medium',
      risk: 'medium',
      strength: 'Trading',
      tehsil: 'Katol',
      customerReach: 'Local Mandi',
      motivation: 'Waste Synergy'
    });
  };

  const sectors = [
    { key: 'Any', label: '✨ Show Me Any Viable Sector' },
    { key: 'Agriculture & Livestock', label: '🌱 Farming & Animal Husbandry' },
    { key: 'Manufacturing', label: '🏗️ Micro-Factories & Food Packaging' },
    { key: 'IT & Services', label: '💻 Computer Services & Internet Cafe' },
    { key: 'Food & Hospitality', label: '🍳 Tea Stall, Cafe & Catering' },
    { key: 'Retail & Trade', label: '🤝 Shopkeeping & Grocery Trading' }
  ];
  const capitalLevels = [
    { key: 'low', label: 'Micro Setup (Less than ₹2 Lakhs)' },
    { key: 'medium', label: 'Small Business (₹2 Lakhs to ₹8 Lakhs)' },
    { key: 'high', label: 'Commercial Setup (More than ₹8 Lakhs)' }
  ];
  const spaceOptions = [
    { key: 'small', label: 'Small Shop or Home Space (Less than 300 sq.ft.)' },
    { key: 'medium', label: 'Commercial Workshop (300 to 1,500 sq.ft.)' },
    { key: 'large', label: 'Open Land / Agrarian Plot (More than 1,500 sq.ft.)' }
  ];
  const strengths = [
    { key: 'Trading', label: '🤝 Business Sales & Shopkeeping' },
    { key: 'Agriculture', label: '🌱 Farming & Animal Husbandry' },
    { key: 'Tech/Digital', label: '💻 Computer Operations & Digital Services' },
    { key: 'Production/Labor', label: '⚙️ Working with Machinery & Labor' },
    { key: 'Food/Cooking', label: '🍳 Cooking, Baking & Catering' }
  ];
  const riskLevels = [
    { key: 'low', label: 'Low Risk (Steady, lower returns)' },
    { key: 'medium', label: 'Medium Risk (Balanced returns)' },
    { key: 'high', label: 'High Risk (Higher growth potential)' }
  ];
  const blocks = ['Katol', 'Narkhed', 'Savner', 'Kalmeshwar', 'Hingna', 'Bhiwapur', 'Umred', 'Kuhi', 'Ramtek', 'Parseoni', 'Mauda', 'Kamptee', 'Nagpur (Rural)'];
  
  const reaches = [
    { key: 'Local Mandi', label: '🌾 APMC Market Yards & Local Grain Mandis' },
    { key: 'Weekly Haat / Bazaar', label: '🛒 Weekly Village Bazaars (Athavadi Bazar)' },
    { key: 'Urban Wholesalers', label: '🏢 Bulk Wholesalers in Nagpur City (Kalamna)' },
    { key: 'Urban Retail / Digital', label: '📱 Door-to-Door & Direct Retail Buyers' }
  ];

  const motivations = [
    { key: 'Daily Cash Flow', label: '💵 Maintain Daily Liquid Cash Flow' },
    { key: 'Long-term Family Employment', label: '🏡 Stable Job Creation for Family Members' },
    { key: 'Waste Synergy', label: '♻️ Utilize Agricultural Crop Waste / Byproducts' },
    { key: 'Export Oriented', label: '✈️ Supply high-quality packaged goods outwards' }
  ];

  return (
    <div className="section-card" style={{ maxWidth: '680px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.5)' }}>
      {step < 9 && (
        <div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '20px' }}>
            <div style={{ width: `${(step / 8) * 100}%`, height: '100%', background: 'var(--color-secondary)', transition: 'width 0.3s ease', borderRadius: '2px' }}></div>
          </div>

          <span className="input-label" style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Venture Diagnostic Matcher — Step {step} of 8</span>
        </div>
      )}

      {/* Step 1: Sector Choice */}
      {step === 1 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What industry or sector interests you most?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Select the area where you want to start your business, or let us recommend the best one.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {sectors.map(sec => (
              <button
                key={sec.key}
                type="button"
                className={`nav-tab ${answers.sector === sec.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '12px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('sector', sec.key)}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Capital */}
      {step === 2 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much money can you invest to start this business?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Include your personal savings and any small loans you plan to take from banks.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {capitalLevels.map(cap => (
              <button
                key={cap.key}
                type="button"
                className={`nav-tab ${answers.capital === cap.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('capital', cap.key)}
              >
                {cap.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Space */}
      {step === 3 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much space or land do you have available?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Can be a shop you own, a corner of your home, or farmland in your village.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {spaceOptions.map(sp => (
              <button
                key={sp.key}
                type="button"
                className={`nav-tab ${answers.space === sp.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('space', sp.key)}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Skills/Strengths */}
      {step === 4 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What is your primary strength or skillset?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Choose what you are best at or have previous working experience in.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {strengths.map(str => (
              <button
                key={str.key}
                type="button"
                className={`nav-tab ${answers.strength === str.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '12px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('strength', str.key)}
              >
                {str.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Risk */}
      {step === 5 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much risk are you comfortable with?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Higher-risk businesses can make more money but have a higher chance of tough times.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {riskLevels.map(r => (
              <button
                key={r.key}
                type="button"
                className={`nav-tab ${answers.risk === r.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('risk', r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Target Block/Taluka */}
      {step === 6 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Which block (Taluka) in Nagpur is your target location?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>We query block-level yields dynamically to recommend businesses with high resource synergy.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {blocks.map(b => (
              <button
                key={b}
                type="button"
                className={`nav-tab ${answers.tehsil === b ? 'active' : ''}`}
                style={{ textAlign: 'center', padding: '10px 4px', margin: 0, border: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => handleSelectOption('tehsil', b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Reach/Channels */}
      {step === 7 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Who is your target customer base?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Decides the primary distribution channels and logistics for your setup.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {reaches.map(rc => (
              <button
                key={rc.key}
                type="button"
                className={`nav-tab ${answers.customerReach === rc.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('customerReach', rc.key)}
              >
                {rc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 8: Motivation */}
      {step === 8 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What is the primary motivation for this business?</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Aligns the opportunity recommendation with your underlying entrepreneurship goals.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {motivations.map(m => (
              <button
                key={m.key}
                type="button"
                className={`nav-tab ${answers.motivation === m.key ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                onClick={() => handleSelectOption('motivation', m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step Buttons */}
      {step < 9 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          <button
            type="button"
            className="nav-tab"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0, visibility: step === 1 ? 'hidden' : 'visible' }}
            onClick={handlePrev}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', 
              border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' 
            }}
            onClick={handleNext}
          >
            {step === 8 ? 'Find My Business Matches' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 9: Results Match Panel */}
      {step === 9 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Recommended Businesses for You</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Top matches calculated based on Nagpur district yield statistics and block synergies.</p>
            </div>
            <button
              type="button"
              className="nav-tab"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontSize: '11px', padding: '6px 12px' }}
              onClick={resetWizard}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.slice(0, 5).map((match, i) => (
              <div 
                key={match.id}
                className="reco-card"
                style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '20px' }}
                onClick={() => onSelectBusiness(match)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--color-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' 
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{match.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Category: {match.sector}</span>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '4px 10px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', 
                    borderRadius: '15px', color: '#22c55e', fontWeight: 'bold', fontSize: '11px' 
                  }}>
                    {match.matchPercent}% Fit
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '10px 0 14px 0', lineHeight: '1.4' }}>{match.description}</p>

                <div style={{ 
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', 
                  fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' 
                }}>
                  <div>
                    Investment Need: <strong style={{ color: '#fff' }}>You\'ll need {match.investment_range} to start</strong>
                  </div>
                  <div>
                    Monthly Profit: <strong style={{ color: '#22c55e' }}>You can earn about {match.monthly_profit_est} per month</strong>
                  </div>
                  <div>
                    Risk Class: <strong style={{ color: match.risk === 'low' ? '#22c55e' : match.risk === 'medium' ? '#eab308' : '#ef4444' }}>
                      Best for {match.risk.toUpperCase()} risk appetites
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
