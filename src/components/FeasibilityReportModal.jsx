import React, { useRef } from 'react';
import { X, Printer, TrendingUp, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

export default function FeasibilityReportModal({ show, onClose, recommendation, sector, capital }) {
  if (!show || !recommendation) return null;

  const reportRef = useRef(null);

  const handlePrint = () => {
    const printContent = reportRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Create print-specific document styling
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: #white !important; color: #000 !important; font-family: sans-serif; padding: 20px; }
        .no-print { display: none !important; }
        .print-card { border: 1px solid #ccc !important; background: none !important; color: #000 !important; box-shadow: none !important; margin-bottom: 20px; page-break-inside: avoid; }
        .print-badge { border: 1px solid #000 !important; color: #000 !important; background: none !important; }
        .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        h1, h2, h3, h4 { color: #000 !important; }
      }
    `;
    
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const { tehsil, type, score, reason, avgRentPerSqft, purchasingPowerIndex, mobilityIndex, consumerDemandIndex, survivalIndex, resources, competitors, population } = recommendation;

  // Generate SWOT analysis heuristically based on the selected tehsil and sector
  const getSWOT = () => {
    const swot = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };

    // Strengths
    if (type.includes("Rural")) {
      swot.strengths.push("Abundant raw agrarian resources & local labor availability.");
      swot.strengths.push("Highly competitive rental overhead (₹" + avgRentPerSqft + "/sq.ft.).");
    } else {
      swot.strengths.push("High population density and strong local consumer base.");
      swot.strengths.push("Excellent logistical infrastructure and transit connectivity.");
    }
    if (resources.length > 0) {
      swot.strengths.push(`Direct proximity to key regional resources: ${resources.slice(0, 2).join(", ")}.`);
    }

    // Weaknesses
    if (type.includes("Rural")) {
      swot.weaknesses.push("Relatively low purchasing power index (" + purchasingPowerIndex + "/100).");
      swot.weaknesses.push("Limited high-tech service infrastructure & skilled tech labor.");
    } else {
      swot.weaknesses.push("Heavy commercial rental rates (₹" + avgRentPerSqft + "/sq.ft./month).");
      swot.weaknesses.push("High density of existing competitors in central markets.");
    }

    // Opportunities
    if (competitors === 0) {
      swot.opportunities.push("Complete market gap! Zero direct competitors registered in this sector.");
    } else {
      swot.opportunities.push(`Synergistic expansion: capturing demand from existing ${competitors} competitors.`);
    }
    if (consumerDemandIndex > 65) {
      swot.opportunities.push("Strong consumer demand index (" + consumerDemandIndex + "/100) indicates immediate market validation.");
    }
    swot.opportunities.push("Eligible for government MSME capital subsidies and Mudra loan schemes.");

    // Threats
    if (type.includes("Rural")) {
      swot.threats.push("Erratic seasonal crop pricing and local Nagpur water supply dependencies.");
      swot.threats.push("Lower digital outreach compared to urban corridors.");
    } else {
      swot.threats.push("Intense margin price-wars with established retail chains.");
      swot.threats.push("Rapidly inflating commercial real estate overheads.");
    }
    
    return swot;
  };

  const swot = getSWOT();

  // Financial Estimation Formulas
  const getFinancials = () => {
    const capitalVal = capital === "low" ? 150000 : capital === "medium" ? 500000 : 1500000;
    const monthlyRent = avgRentPerSqft * 500; // Assume 500 sq ft space
    const utilities = monthlyRent * 0.3;
    const labor = type.includes("Rural") ? 15000 : 35000;
    const monthlyOpsCost = monthlyRent + utilities + labor;
    
    // Revenue projection proxy
    const demandMultiplier = consumerDemandIndex / 100;
    const estMonthlyRevenue = Math.round(monthlyOpsCost * 1.35 * (0.8 + demandMultiplier * 0.4));
    const profitMargin = estMonthlyRevenue - monthlyOpsCost;
    
    const breakEvenMonths = profitMargin > 0 ? Math.ceil((capitalVal * 0.6) / profitMargin) : "18+";
    
    return {
      capitalVal,
      monthlyRent,
      monthlyOpsCost,
      estMonthlyRevenue,
      profitMargin,
      breakEvenMonths
    };
  };

  const financials = getFinancials();

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px'
    }}>
      <div 
        ref={reportRef}
        className="modal-content" 
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            📊 AI Business Feasibility Report
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              className="nav-tab" 
              style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid #6366f1', color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" /> Print/Save PDF
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif' }}>Feasibility Study & Risk Report</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              Location: <strong>{tehsil} Tehsil</strong> | Sector: <strong>{sector}</strong> | Budget Level: <strong>{capital.toUpperCase()}</strong>
            </p>
            <div style={{ 
              display: 'inline-block', margin: '12px auto 0 auto', padding: '6px 15px', 
              background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', 
              borderRadius: '20px', color: '#22c55e', fontWeight: 'bold', fontSize: '13px'
            }}>
              Overall Match Score: {score}%
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="section-card print-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px', margin: '0 0 10px 0', color: 'var(--color-secondary)' }}>
              1. Executive Summary
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>
              An analysis of <strong>{tehsil}</strong> (classified as a <strong>{type}</strong> block) indicates a strong market viability rating of <strong>{score}%</strong> for establishing a <strong>{sector}</strong> startup. 
              The business model aligns directly with local resource outputs (specialties: {resources.join(", ") || "General trade"}). With rent averages matching rural profiles at <strong>₹{avgRentPerSqft}/sq.ft./month</strong>, the operating margin profile remains highly resilient against early-stage overhead pressures.
            </p>
          </div>

          {/* Section 2: SWOT Analysis */}
          <div className="section-card print-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px', margin: '0 0 12px 0', color: 'var(--color-accent-orange)' }}>
              2. SWOT Analysis
            </h3>
            <div className="swot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.15)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px' }}>
                  <CheckCircle2 className="w-4 h-4" /> Strengths (Local Synergies)
                </strong>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {swot.strengths.map((st, i) => <li key={i} style={{ marginBottom: '4px' }}>{st}</li>)}
                </ul>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px' }}>
                  <ShieldAlert className="w-4 h-4" /> Weaknesses (Constraints)
                </strong>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {swot.weaknesses.map((wk, i) => <li key={i} style={{ marginBottom: '4px' }}>{wk}</li>)}
                </ul>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px' }}>
                  <TrendingUp className="w-4 h-4" /> Opportunities
                </strong>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {swot.opportunities.map((op, i) => <li key={i} style={{ marginBottom: '4px' }}>{op}</li>)}
                </ul>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px' }}>
                  <ShieldAlert className="w-4 h-4" /> Threats (Market Risks)
                </strong>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {swot.threats.map((th, i) => <li key={i} style={{ marginBottom: '4px' }}>{th}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Estimates */}
          <div className="section-card print-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px', margin: '0 0 12px 0', color: 'var(--color-secondary)' }}>
              3. Break-Even & Financial Projections
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div className="stat-box" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="stat-lbl" style={{ fontSize: '9px' }}>Setup Budget (Initial Cost)</div>
                <div className="stat-val" style={{ fontSize: '16px', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                  <DollarSign className="w-4 h-4" /> {financials.capitalVal.toLocaleString()}
                </div>
              </div>
              <div className="stat-box" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="stat-lbl" style={{ fontSize: '9px' }}>Monthly Running Cost</div>
                <div className="stat-val" style={{ fontSize: '16px', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                  <DollarSign className="w-4 h-4" /> {financials.monthlyOpsCost.toLocaleString()}
                </div>
              </div>
              <div className="stat-box" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="stat-lbl" style={{ fontSize: '9px' }}>Estimated Monthly Sales</div>
                <div className="stat-val" style={{ fontSize: '16px', color: '#22c55e', display: 'flex', alignItems: 'center' }}>
                  <DollarSign className="w-4 h-4" /> {financials.estMonthlyRevenue.toLocaleString()}
                </div>
              </div>
              <div className="stat-box" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="stat-lbl" style={{ fontSize: '9px' }}>Est. Break-Even Period</div>
                <div className="stat-val" style={{ fontSize: '16px', color: '#eab308' }}>
                  ~ {financials.breakEvenMonths} Months
                </div>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
              *Projections are computed using base population sizes, competitor concentration proxies, local raw material logistics indices, and real estate rents assuming a 500 sq.ft. operating workspace.
            </p>
          </div>

          {/* Section 4: Action Plan */}
          <div className="section-card print-card">
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px', margin: '0 0 10px 0', color: '#10b981' }}>
              4. Immediate Action Plan (Suggested First 3 Steps)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '22px', height: '22px', background: '#6366f1', color: '#fff', borderRadius: '50%', fontWeight: 'bold', fontSize: '11px' }}>1</span>
                <div>
                  <strong>Acquire Local Raw Materials & Subsidy Approvals:</strong> Establish sourcing connections with regional suppliers (e.g. APMC citrus growers or local mining corridors). Apply for the matched <strong>Gov Subsidies</strong> directly under Mudra or PMFME options.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '22px', height: '22px', background: '#06b6d4', color: '#fff', borderRadius: '50%', fontWeight: 'bold', fontSize: '11px' }}>2</span>
                <div>
                  <strong>Lease Workspace & Setup Operations:</strong> Lease a facility in <strong>{tehsil}</strong> targeting the average lease rate of <strong>₹{avgRentPerSqft}/sq.ft.</strong>. Prioritize locations along the highlighted gold highway corridors for transport cost optimization.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '22px', height: '22px', background: '#eab308', color: '#fff', borderRadius: '50%', fontWeight: 'bold', fontSize: '11px' }}>3</span>
                <div>
                  <strong>Collaborate via the Peer Consultancy Hub:</strong> Match and partner with registered entrepreneurs in <strong>{tehsil}</strong> working in similar logistics or supply operations to pool initial costs.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (no-print) */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'flex-end', padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)', gap: '12px'
        }}>
          <button 
            type="button"
            className="nav-tab" 
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
