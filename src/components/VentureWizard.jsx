import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Landmark, Shield, HelpCircle, Layers, CheckCircle2, User, Award } from 'lucide-react';
import businessArchetypes from '../data/business_archetypes.json';

export default function VentureWizard({ onSelectBusiness }) {
  // Mode selection: null (choose mode) | 'beginner' | 'advanced'
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(1);
  
  // Answers state for both modes
  const [answers, setAnswers] = useState({
    // Shared
    tehsil: 'Katol',
    capital: 'medium',
    
    // Beginner specific
    savingsClass: 'under_50k',
    dailyLife: 'Agriculture',
    beginnerGoal: 'daily_cash',
    
    // Advanced specific
    sector: 'Any',
    space: 'medium',
    risk: 'medium',
    strength: 'Trading',
    customerReach: 'Local Mandi',
    motivation: 'Waste Synergy'
  });
  
  const [results, setResults] = useState([]);

  const handleSelectOption = (field, val) => {
    setAnswers({ ...answers, [field]: val });
  };

  const handleNext = () => {
    const maxSteps = mode === 'beginner' ? 4 : 8;
    if (step < maxSteps) {
      setStep(step + 1);
    } else {
      calculateMatches();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setMode(null); // Go back to mode selector
    }
  };

  const calculateMatches = () => {
    const scoredList = businessArchetypes.map(archetype => {
      let score = 40; // Starting baseline

      if (mode === 'beginner') {
        // --- BEGINNER MODE SCORING PIPELINE ---
        
        // 1. Savings Level mapping
        // 'under_50k' -> low capital archetypes
        // '50k_to_2lakh' -> low/medium
        // '2lakh_to_5lakh' -> medium
        // 'above_5lakh' -> medium/high
        if (answers.savingsClass === 'under_50k') {
          if (archetype.capital === 'low') score += 30;
          else score -= 15;
        } else if (answers.savingsClass === '50k_to_2lakh') {
          if (archetype.capital === 'low') score += 20;
          else if (archetype.capital === 'medium') score += 15;
        } else if (answers.savingsClass === '2lakh_to_5lakh') {
          if (archetype.capital === 'medium') score += 25;
          else if (archetype.capital === 'low') score += 10;
        } else if (answers.savingsClass === 'above_5lakh') {
          if (archetype.capital === 'high') score += 30;
          else if (archetype.capital === 'medium') score += 20;
        }

        // 2. Daily Life Skills mapping to sector skills
        const skillsMap = {
          'Agriculture': 'Agriculture & Livestock',
          'Cooking': 'Food & Hospitality',
          'Tech': 'IT & Services',
          'Trading': 'Retail & Trade',
          'Labor': 'Manufacturing'
        };
        const targetSector = skillsMap[answers.dailyLife];
        if (archetype.sector === targetSector) {
          score += 25;
        }

        // 3. Goal Alignment
        if (answers.beginnerGoal === 'daily_cash') {
          if (['Retail & Trade', 'Food & Hospitality'].includes(archetype.sector)) {
            score += 15;
          }
        } else if (answers.beginnerGoal === 'family_biz') {
          if (['Retail & Trade', 'Agriculture & Livestock'].includes(archetype.sector)) {
            score += 15;
          }
        } else if (answers.beginnerGoal === 'waste_crops') {
          if (['Manufacturing', 'Agriculture & Livestock'].includes(archetype.sector)) {
            score += 20;
          }
        }

      } else {
        // --- ADVANCED MODE SCORING PIPELINE ---
        
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
          score += 8;
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

        // 5. Strength / Skills Synergy
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

        // 6. Customer Reach Alignment
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

        // 7. Motivation Alignment
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
      }

      // --- SHARED BLOCK AGRONOMY CROP SYNERGIES ---
      const selectedBlock = answers.tehsil;
      if (archetype.id === 'orange_pulp') {
        if (['Katol', 'Narkhed', 'Savner', 'Kalmeshwar'].includes(selectedBlock)) {
          score += 25;
        }
      } else if (archetype.id === 'cold_pressed_oil') {
        if (['Kuhi', 'Mauda', 'Umred', 'Hingna'].includes(selectedBlock)) {
          score += 25;
        }
      } else if (archetype.id === 'cotton_roll') {
        if (['Narkhed', 'Savner', 'Katol', 'Kalmeshwar'].includes(selectedBlock)) {
          score += 25;
        }
      } else if (archetype.id === 'spices_grinding') {
        if (selectedBlock === 'Bhiwapur') {
          score += 35;
        } else if (['Umred', 'Kuhi'].includes(selectedBlock)) {
          score += 20;
        }
      } else if (archetype.id === 'fly_ash_bricks') {
        if (['Kamptee', 'Mauda', 'Savner'].includes(selectedBlock)) {
          score += 25;
        }
      }

      // Cap score between 35% and 99%
      const finalPercent = Math.max(35, Math.min(99, score));

      return {
        ...archetype,
        matchPercent: finalPercent
      };
    });

    const sorted = scoredList.sort((a, b) => b.matchPercent - a.matchPercent);
    setResults(sorted);
    setStep(mode === 'beginner' ? 5 : 9); // Result step index based on mode
  };

  const resetWizard = () => {
    setMode(null);
    setStep(1);
    setResults([]);
    setAnswers({
      tehsil: 'Katol',
      capital: 'medium',
      savingsClass: 'under_50k',
      dailyLife: 'Agriculture',
      beginnerGoal: 'daily_cash',
      sector: 'Any',
      space: 'medium',
      risk: 'medium',
      strength: 'Trading',
      customerReach: 'Local Mandi',
      motivation: 'Waste Synergy'
    });
  };

  // Advanced Mode Options
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
  
  // Shared
  const blocks = ['Katol', 'Narkhed', 'Savner', 'Kalmeshwar', 'Hingna', 'Bhiwapur', 'Umred', 'Kuhi', 'Ramtek', 'Parseoni', 'Mauda', 'Kamptee', 'Nagpur (Rural)'];

  // Beginner Mode Options
  const savingsOptions = [
    { key: 'under_50k', label: '💵 Under ₹50,000 (Very small starting cash)' },
    { key: '50k_to_2lakh', label: '💵 ₹50,000 to ₹2 Lakhs (Moderate savings)' },
    { key: '2lakh_to_5lakh', label: '💵 ₹2 Lakhs to ₹5 Lakhs (Medium investment)' },
    { key: 'above_5lakh', label: '💵 More than ₹5 Lakhs (Commercial plans)' }
  ];

  const dailyLifeOptions = [
    { key: 'Agriculture', label: '🌾 Working on farms / caring for cattle' },
    { key: 'Cooking', label: '🍳 Cooking food at home or managing a kitchen' },
    { key: 'Tech', label: '📱 Using smartphones and computers' },
    { key: 'Trading', label: '🤝 Talking to people and selling things' },
    { key: 'Labor', label: '⚙️ Working with building tools or machinery' }
  ];

  const goalOptions = [
    { key: 'daily_cash', label: '💵 Make steady cash to pay daily family expenses' },
    { key: 'family_biz', label: '🏡 Set up a stable shop where family can work' },
    { key: 'waste_crops', label: '♻️ Process my block\'s farm crops to prevent spoilage' }
  ];

  return (
    <div className="section-card" style={{ maxWidth: '680px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.5)' }}>
      
      {/* MODE SELECTOR STEP */}
      {mode === null && (
        <div style={{ padding: '10px 0', textAlign: 'center' }}>
          <span className="resource-badge agriculture" style={{ fontSize: '10px', marginBottom: '8px', display: 'inline-block' }}>
            Venture Khoj Matching Engine
          </span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '24px', margin: '0 0 10px 0' }}>
            Find the right business in Nagpur
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
            Tell us about your background and savings. We will match you with business ideas backed by real Nagpur crop yields and mandi demand.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
            {/* Beginner Mode Card */}
            <div 
              className="section-card" 
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', padding: '24px', border: '1px solid rgba(6, 182, 212, 0.2)', textAlign: 'left' }}
              onClick={() => { setMode('beginner'); setStep(1); }}
            >
              <User className="w-8 h-8 text-cyan-400" />
              <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>I am a Beginner (Help Me Choose)</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                If you have savings but do not know what business to open. Simple, non-technical questions in plain language.
              </p>
            </div>

            {/* Advanced Analyst Card */}
            <div 
              className="section-card" 
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', padding: '24px', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'left' }}
              onClick={() => { setMode('advanced'); setStep(1); }}
            >
              <Award className="w-8 h-8 text-indigo-400" />
              <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Advanced Profiling (Analyst mode)</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Set precise filters for industry sectors, available space parameters, motivation tags, and risk indexes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS BAR FOR ACTIVE MODE */}
      {mode !== null && step < (mode === 'beginner' ? 5 : 9) && (
        <div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '20px' }}>
            <div style={{ width: `${(step / (mode === 'beginner' ? 4 : 8)) * 100}%`, height: '100%', background: 'var(--color-secondary)', transition: 'width 0.3s ease', borderRadius: '2px' }}></div>
          </div>
          <span className="input-label" style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>
            Venture Diagnostics ({mode === 'beginner' ? 'Beginner Mode' : 'Advanced Mode'}) — Step {step} of {mode === 'beginner' ? 4 : 8}
          </span>
        </div>
      )}

      {/* ================= BEGINNER MODE STEPS ================= */}
      {mode === 'beginner' && (
        <div style={{ marginTop: '10px' }}>
          
          {/* Step 1: Location selection */}
          {step === 1 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Which village block (Taluka) do you live in?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>We check crop yields in your block to find businesses that don't need expensive shipping.</p>
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

          {/* Step 2: Savings class */}
          {step === 2 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much of your savings can you invest?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Choose the cash range you are comfortable using to set up the startup.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {savingsOptions.map(save => (
                  <button
                    key={save.key}
                    type="button"
                    className={`nav-tab ${answers.savingsClass === save.key ? 'active' : ''}`}
                    style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                    onClick={() => handleSelectOption('savingsClass', save.key)}
                  >
                    {save.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Daily Life skills */}
          {step === 3 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What do you do in your daily life?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>This helps us recommend a business that matches skills you already use every day.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {dailyLifeOptions.map(dl => (
                  <button
                    key={dl.key}
                    type="button"
                    className={`nav-tab ${answers.dailyLife === dl.key ? 'active' : ''}`}
                    style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                    onClick={() => handleSelectOption('dailyLife', dl.key)}
                  >
                    {dl.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Primary Goal */}
          {step === 4 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What is your main hope for this business?</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Select the primary goal you wish to achieve with your new venture.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {goalOptions.map(g => (
                  <button
                    key={g.key}
                    type="button"
                    className={`nav-tab ${answers.beginnerGoal === g.key ? 'active' : ''}`}
                    style={{ textAlign: 'left', padding: '14px 16px', margin: 0, border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}
                    onClick={() => handleSelectOption('beginnerGoal', g.key)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= ADVANCED ANALYST STEPS ================= */}
      {mode === 'advanced' && (
        <div style={{ marginTop: '10px' }}>
          
          {/* Step 1: Industry choice */}
          {step === 1 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What industry or sector interests you most?</h3>
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

          {/* Step 2: Capital investment */}
          {step === 2 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much money can you invest to start this business?</h3>
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

          {/* Step 3: Available Space */}
          {step === 3 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much space or land do you have available?</h3>
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

          {/* Step 4: Skills */}
          {step === 4 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What is your primary strength or skillset?</h3>
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

          {/* Step 5: Risk comfort */}
          {step === 5 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>How much risk are you comfortable with?</h3>
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

          {/* Step 6: Target Block */}
          {step === 6 && (
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Which block (Taluka) in Nagpur is your target location?</h3>
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
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Who is your target customer base?</h3>
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
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>What is the primary motivation for this business?</h3>
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

        </div>
      )}

      {/* NAVIGATION STEP CONTROL FOOTER */}
      {mode !== null && step < (mode === 'beginner' ? 5 : 9) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          <button
            type="button"
            className="nav-tab"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}
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
            {step === (mode === 'beginner' ? 4 : 8) ? 'Find My Business Matches' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RESULTS DISPLAY VIEW */}
      {((mode === 'beginner' && step === 5) || (mode === 'advanced' && step === 9)) && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', color: '#fff' }}>Recommended Businesses for You</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                {mode === 'beginner' 
                  ? 'Easiest setups matching your savings and experience in your block.' 
                  : 'Analytical scoring matching your precise filters & yields.'}
              </p>
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
                    Investment Need: <strong style={{ color: '#fff' }}>You'll need {match.investment_range} to start</strong>
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
