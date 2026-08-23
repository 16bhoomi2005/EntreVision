import React, { useState } from 'react';
import { X, CheckSquare, Square, DollarSign, BookOpen, AlertTriangle, Users, Award, FileText, ArrowRight } from 'lucide-react';

export default function BusinessDetailModal({ show, onClose, business, onLocateOnMap, selectedTehsil }) {
  if (!show || !business) return null;

  // Use selected tehsil or default to Katol for context
  const activeTehsil = selectedTehsil || "Katol";

  const [checklistState, setChecklistState] = useState(
    business.checklist.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const toggleChecklistItem = (item) => {
    setChecklistState({ ...checklistState, [item]: !checklistState[item] });
  };

  const { id, name, sector, description, investment_range, monthly_profit_est, break_even_months, checklist, costs_breakdown, raw_materials } = business;

  // 1. Demand & Mandi details mapping
  const getMandiDetails = () => {
    const maps = {
      Katol: { name: "Katol APMC Orange Market", dist: "2 km", channel: "Orange Growers Cooperative / APMC auction" },
      Narkhed: { name: "Narkhed Grain Mandi", dist: "3 km", channel: "Local FPO traders" },
      Saoner: { name: "Saoner Cotton & Grain APMC", dist: "4 km", channel: "Cotton Corporation of India (CCI)" },
      Kalmeshwar: { name: "Kalmeshwar APMC Yard", dist: "2 km", channel: "Wholesale grain distributors" },
      Bhiwapur: { name: "Bhiwapur Chilli Market Yard", dist: "1 km", channel: "B2B Spice Spices Association" },
      Umred: { name: "Umred Sub-APMC Yard", dist: "3 km", channel: "Mining township retail dealers" },
      Kuhi: { name: "Kuhi Market Center", dist: "2 km", channel: "Local weekly bazaar (Athavadi Bazar)" },
      Hingna: { name: "Nagpur Kalamna Central Mandi", dist: "18 km", channel: "Urban food distributors" },
      Kamptee: { name: "Nagpur Kalamna Market", dist: "14 km", channel: "Bulk institutional food contracts" },
      Mouda: { name: "Mouda APMC Sub-center", dist: "3 km", channel: "Local grain pool" }
    };
    return maps[activeTehsil] || { name: "Nagpur Kalamna Central APMC", dist: "25 km", channel: "District wholesale market networks" };
  };

  const mandiInfo = getMandiDetails();

  // 2. Training details mapping
  const getTrainingInfo = () => {
    if (sector === "Agriculture & Livestock") {
      return {
        level: "Medium",
        center: "Krishi Vigyan Kendra (KVK) Nagpur",
        course: "Organic Farming & Fruit Processing Technology",
        duration: "2 Weeks (Free Government Batch)"
      };
    } else if (sector === "Manufacturing") {
      return {
        level: "High",
        center: "Government ITI Hingna",
        course: "Automated Machine Operator & Brick Press Maintenance",
        duration: "3 Months (Certificate Course)"
      };
    } else {
      return {
        level: "Low",
        center: "District Industries Center (DIC) Hub",
        course: "Basic Retail Bookkeeping & Digital Payments (UPI) setup",
        duration: "3 Days (Micro-Workshop)"
      };
    }
  };

  const training = getTrainingInfo();

  // 3. Risks mapping
  const getRiskNotes = () => {
    const risks = {
      orange_pulp: [
        "Orange prices crash after winter harvest season—buy raw fruit early and freeze concentrates.",
        "Requires highly sterile food packaging or pulp spoils within 15 days.",
        "High electricity cuts in Katol—a solar inverter backup is recommended for cooling."
      ],
      fly_ash_bricks: [
        "Brick edges can chip during heavy truck transit—use sawdust dividers during packing.",
        "Fly ash supply depends on power plants operating; source from multiple thermal plants.",
        "High competition from red soil clay bricks—advertise green fly ash as eco-friendly and cheaper."
      ],
      cotton_roll: [
        "Raw cotton pricing varies dynamically—lock raw supply rates with farmers before sowing.",
        "Needs high dry ventilation space; wet humidity ruins bleached cotton inventories.",
        "Strict FDA drug licenses required for surgical dressings."
      ],
      cold_pressed_oil: [
        "Raw soybean seeds prices spike in off-season—purchase raw stocks in bulk during harvest.",
        "Natural oils collect sediment at bottom—educate customers that sediment proves purity.",
        "High heat ruins cold-pressed nutrients; store in amber bottles."
      ],
      spices_grinding: [
        "Chilli dust causes severe respiratory discomfort—exhaust fans and masks are mandatory.",
        "Spices spoil if exposed to damp rain—use heat-sealed polybags.",
        "Umred has competitor spice mills—use Bhiwapur red chilli branding to stand out."
      ],
      dairy_farm: [
        "Fodder shortages in summer can reduce daily milk yields—plant green silage early.",
        "Milk spoils within 4 hours of milking without refrigeration; chilling tank is critical.",
        "Diseases like Mastitis require regular veterinary vaccination."
      ]
    };
    return risks[id] || [
      "Lease rents can rise unexpectedly—always sign a minimum 3-year commercial rent lease agreement.",
      "High local competition can dilute margins—focus on door-to-door delivery or credit customer relationships.",
      "Requires consistent working capital runway—keep at least 3 months operational buffer in cash."
    ];
  };

  const risksList = getRiskNotes();

  // 4. Peer matching lookup
  const getLocalPeers = () => {
    const peers = {
      orange_pulp: [{ name: "Ramesh Patil", tehsil: "Kuhi", status: "Operating Orange Pulping since 2024" }],
      spices_grinding: [{ name: "Sunita Deshmukh", tehsil: "Bhiwapur", status: "Running Chilli grinding brand since 2025" }],
      solar_pump_dealership: [{ name: "Amit Raut", tehsil: "Narkhed", status: "Solar dealer and subsidy facilitator" }]
    };
    return peers[id] || [{ name: "Abhishek Patil", tehsil: "Katol", status: "Micro-entrepreneur partner registered in 2026" }];
  };

  const localPeersList = getLocalPeers();

  // 5. Paperwork & Schemes
  const getPaperworkClearances = () => {
    let items = ["Udyam MSME Registration (Online, takes 1 day)"];
    if (sector === "Agriculture & Livestock" || id === "micro_bakery") {
      items.push("FSSAI Food License (Takes about a week, mostly online)");
    }
    if (costs_breakdown.machinery > 200000) {
      items.push("GST Registration (Online, takes 3 days)");
      items.push("Local Panchayat Trade NOC (Offline, takes 5 days)");
    }
    return items;
  };

  const paperwork = getPaperworkClearances();

  const getMatchedSchemes = () => {
    if (sector === "Agriculture & Livestock") {
      return [
        { name: "PMFME Scheme Subsidy", details: "Provides 35% cash subsidy on food machinery setup (Apply on pmfme.mofpi.gov.in)." },
        { name: "Mudra Loan (Kishor Category)", details: "Collateral-free bank loan up to ₹5 Lakhs with low rural interest rates." }
      ];
    } else if (sector === "Manufacturing") {
      return [
        { name: "PMEGP Scheme Credit", details: "Provides up to 35% subsidy on manufacturing capital setups in rural towns." }
      ];
    } else {
      return [
        { name: "Mudra Shishu Loan", details: "Zero-collateral micro-loans up to ₹50,000 to purchase computers, tools, or furniture." }
      ];
    }
  };

  const matchedSchemesList = getMatchedSchemes();

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: 'rgba(30, 41, 59, 0.98)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '94vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Modal Top Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <span className="resource-badge agriculture" style={{ fontSize: '9px', marginBottom: '4px', display: 'inline-block' }}>
              {sector}
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              💼 {name}
            </h2>
          </div>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 8-Section Structured Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Description block */}
          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
              <strong>Business Description:</strong> {description}
            </p>
          </div>

          {/* 1. Demand Mapping */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6366f1', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp className="w-4 h-4" /> 1. Is there demand in {activeTehsil} block?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Local saturation signal:</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#fff' }}>
                  Low-Medium competitor density in {activeTehsil}.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nearest Wholesale Mandi:</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#fff' }}>
                  {mandiInfo.name} ({mandiInfo.dist} away)
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px', gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-muted)' }}>Primary Selling Channels:</span>
                <p style={{ margin: '4px 0 0 0', color: '#cbd5e1' }}>
                  Deliver raw/packaged outputs directly via: <strong>{mandiInfo.channel}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Costs & Year 1 Survival */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#10b981', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign className="w-4 h-4" /> 2. What will it cost me, and can I survive year one?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Cost table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', background: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>STARTING COSTS (ESTIMATED):</span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Machinery & Tools:</span>
                  <span>₹{costs_breakdown.machinery.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shed / Shop Lease deposit:</span>
                  <span>₹{costs_breakdown.rent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Raw Materials Stock:</span>
                  <span>₹{Math.round(costs_breakdown.working_capital * 0.4).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>3-Month Expenses Buffer:</span>
                  <span>₹{Math.round(costs_breakdown.working_capital * 0.6).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', fontWeight: 'bold', color: '#10b981', fontSize: '13px' }}>
                  <span>Total Capital Needed:</span>
                  <span>{investment_range}</span>
                </div>
              </div>

              {/* Survival details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Expected Monthly Income (Once running):</span>
                  <div style={{ fontSize: '15px', color: '#22c55e', fontWeight: 'bold', marginTop: '2px' }}>{monthly_profit_est}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Break-Even Timeline:</span>
                  <div style={{ fontSize: '15px', color: '#eab308', fontWeight: 'bold', marginTop: '2px' }}>~{break_even_months} Months</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Supplier supply chain */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#06b6d4', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen className="w-4 h-4" /> 3. Where do I get supply?
            </h4>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
              Primary crop inputs can be sourced directly from local harvesting associations in: <strong>{getSourcingHotspots()}</strong>.
              <br />
              <span style={{ color: 'var(--text-muted)' }}>Supply Schedule:</span> Major crops are harvested during the **Kharif season (October-December)**. For off-season operating, it is advised to stockpile raw seed stocks in dry bags or diversify into multi-grain grinding during summer.
            </p>
          </div>

          {/* 4. Training requirements */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#06b6d4', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎓 4. Do I need training?
            </h4>
            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ margin: 0 }}>
                Technical skill requirement level: <strong>{training.level}</strong>.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ color: '#fff' }}>{training.center}</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Course: {training.course} ({training.duration})</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Paperwork & subventions */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#eab308', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📋 5. What paperwork do I need?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', fontSize: '12px' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#fff', display: 'block', marginBottom: '6px' }}>REQUIRED PERMITS:</span>
                <ul style={{ paddingLeft: '18px', margin: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {paperwork.map((p, idx) => <li key={idx}>{p}</li>)}
                </ul>
              </div>

              <div>
                <span style={{ fontWeight: 'bold', color: '#fff', display: 'block', marginBottom: '6px' }}>ELIGIBLE LOANS & SUBSIDIES:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {matchedSchemesList.map((sch, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <strong>{sch.name}</strong>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{sch.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Honest Risks */}
          <div className="section-card" style={{ margin: 0, borderLeft: '4px solid #ef4444' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ef4444', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle className="w-4 h-4" /> 6. What usually goes wrong? (Honest Risks)
            </h4>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.5' }}>
              {risksList.map((risk, idx) => <li key={idx}>{risk}</li>)}
            </ul>
          </div>

          {/* 7. Peer matching & Success link */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#a855f7', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users className="w-4 h-4" /> 7. Talk to someone doing this already
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              {localPeersList.map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Location: {p.tehsil} block | Status: {p.status}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--color-secondary)', fontWeight: 'bold' }}>Connect with Partner</span>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Action Checklist & Report download */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#eab308', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📋 8. Next steps / Action Checklist
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {checklist.map((item) => (
                <div 
                  key={item} 
                  style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '12px' }}
                  onClick={() => toggleChecklistItem(item)}
                >
                  {checklistState[item] ? (
                    <CheckSquare className="w-5 h-5 text-green-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-500" />
                  )}
                  <span style={{ textDecoration: checklistState[item] ? 'line-through' : 'none', color: checklistState[item] ? '#94a3b8' : '#e2e8f0' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}
                onClick={() => window.print()}
              >
                <FileText className="w-5 h-5" /> Download My Full Plan as PDF
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
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
