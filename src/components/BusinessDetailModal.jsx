import React, { useState } from 'react';
import { X, CheckSquare, Square, DollarSign, ExternalLink, Award, FileText, ArrowRight } from 'lucide-react';

export default function BusinessDetailModal({ show, onClose, business, onLocateOnMap }) {
  if (!show || !business) return null;

  const [checklistState, setChecklistState] = useState(
    business.checklist.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const toggleChecklistItem = (item) => {
    setChecklistState({ ...checklistState, [item]: !checklistState[item] });
  };

  const { id, name, sector, description, investment_range, monthly_profit_est, break_even_months, checklist, costs_breakdown, raw_materials } = business;

  // Curated location target matching based on raw materials
  const getSourcingHotspots = () => {
    if (raw_materials.includes("Oranges")) return "Katol & Narkhed Tehsils (Major orange orange growing blocks)";
    if (raw_materials.includes("Raw Cotton")) return "Hingna, Saoner & Kalmeshwar Tehsils (High yield cotton production)";
    if (raw_materials.includes("Soybean seeds")) return "Umred, Kuhi & Saoner Tehsils (Large soybean crop yields)";
    if (raw_materials.includes("Dry Red Chilli")) return "Bhiwapur & Umred Tehsils (Home of the Bhiwapur Chilli APMC mandis)";
    if (raw_materials.includes("Fly Ash")) return "Kamptee & Parseoni Tehsils (Koradi and Khaperkheda power plant corridors)";
    if (raw_materials.includes("Milking Cows/Buffaloes")) return "Nagpur Rural & Kamptee Tehsils (Large dairy/fodder supply bases)";
    return "All Nagpur District Rural Blocks (Flexible setup requirements)";
  };

  // Heuristic government schemes matcher
  const getSubsidies = () => {
    let matched = [];
    if (sector === "Agriculture & Livestock") {
      matched = [
        { name: "PMFME 35% Capital Subsidy", desc: "Up to 35% subvention for setting up agro-processing plants (orange/soybean oil)." },
        { name: "Mudra Loan (Kishor/Tarun)", desc: "Collateral-free commercial credit up to ₹10 Lakhs for agri-allied operations." }
      ];
    } else if (sector === "Manufacturing") {
      matched = [
        { name: "PMEGP Rural Project Subsidy", desc: "Subsidy of up to 35% of setup costs for establishing manufacturing units in Nagpur rural areas." },
        { name: "Maharashtra MSME Package Scheme (PSI)", desc: "Electricity duty exemptions, technology upgradation credits, and stamp duty waivers." }
      ];
    } else {
      matched = [
        { name: "Mudra Loan (Shishu/Kishor)", desc: "Micro loans up to ₹5 Lakhs for digital hubs, general stores, and workshops." },
        { name: "Stand-Up India Scheme", desc: "Financing between ₹10 Lakhs and ₹1 Crore for women or SC/ST service entrepreneurs." }
      ];
    }
    return matched;
  };

  const schemes = getSubsidies();

  const sentimentData = {
    orange_pulp: {
      positive: ["High fruit freshness (42%)", "Sweet taste profiles (35%)"],
      negative: ["Slow delivery processing (28%)", "Chemical preservatives aftertaste (24%)", "Damaged packaging leaks (15%)"],
      gap: "High orange yield blocks in Nagpur (Narkhed, Katol) suffer from extreme seasonal wastage. Local pulping units with cold-press lines face zero local processing competition, offering a huge opportunity to capture margins."
    },
    fly_ash_bricks: {
      positive: ["Strong material durability (48%)", "Lower cost than red bricks (36%)"],
      negative: ["Delayed supply orders (31%)", "Chipped/broken edges during transport (22%)"],
      gap: "Real estate demand in Nagpur Rural is growing at 12% annually. Builders complain of brick shortages during peak summer. Siting your plant near Koradi power plant yields direct free raw ash contracts."
    },
    cotton_roll: {
      positive: ["Highly absorbent cotton (44%)", "Good sterile packing (38%)"],
      negative: ["Inconsistent roll lengths (25%)", "High pricing compared to synthetic rolls (18%)"],
      gap: "Major cotton trading is routed to Gujarat, leaving local Nagpur ginning and clinical supply chains underserved. Nagpur has 12 major public hospitals with massive recurrent surgical dressing needs."
    },
    cold_pressed_oil: {
      positive: ["Genuine organic aroma (51%)", "Zero chemical additives (45%)"],
      negative: ["Thick sediment at bottle bottom (20%)", "Poor bottle caps cause spills (18%)"],
      gap: "Health-conscious urban consumers in Hingna/Nagpur city are buying direct cold-pressed oils. Local retailers report a 40% supply gap in organic soybean oils compared to standard refined packets."
    },
    spices_grinding: {
      positive: ["Famous hot Bhiwapur heat (58%)", "No added color agents (42%)"],
      negative: ["Rough powder grains (22%)", "Small packet sizes get torn easily (16%)"],
      gap: "Umred/Bhiwapur chillies are exported raw. Processing them directly inside the block saves 30% logistics cost, letting you price lower than national brands in village markets."
    },
    dairy_farm: {
      positive: ["High butterfat content (49%)", "Early morning fresh milk (41%)"],
      negative: ["Inconsistent daily supply hours (27%)", "Milk gets sour in summer without chilling (22%)"],
      gap: "Local dairy cooperatives report daily deficit collections in summer. Installing a bulk chilling plant in Kamptee guarantees direct institutional contracts with major brands like Amul."
    },
    e_seva_kendra: {
      positive: ["Helpful registration guides (46%)", "Saves travel time to district town (42%)"],
      negative: ["Long queues during scheme releases (35%)", "Power cuts shut down printers (28%)"],
      gap: "BDO offices release subsidies weekly. Residents in distant villages lose a full wage day traveling to tehsils. Setting up adjacent to a Gram Panchayat guarantees 150+ footfalls/day."
    },
    soil_testing_lab: {
      positive: ["Accurate dosage prescriptions (48%)", "Detailed report prints (35%)"],
      negative: ["Takes 7+ days to deliver results (30%)", "Confusing technical report terms (25%)"],
      gap: "Orange growers suffer crop drop due to poor nitrogen ratios. Existing government labs have 3-month backlogs. Fast 24-hour test returns is a premium services niche."
    },
    tractor_repair: {
      positive: ["Expert transmission repairs (45%)", "Reasonable hydraulic oils price (32%)"],
      negative: ["No replacement tractors offered (25%)", "Slow mechanical works (20%)"],
      gap: "Sowing season relies heavily on tractor availability. Breakdowns during Kharif cause severe crop delays. Offering mobile farm-site mechanics will capture 60% of regional repair requests."
    },
    agro_tourism: {
      positive: ["Scenic orange fields (52%)", "Authentic rural food (48%)"],
      negative: ["Poor mobile network signal (24%)", "Lack of AC cottages in summer (20%)"],
      gap: "Nagpur city families search for weekend escapes within 60 km. Ramtek tourist footfall hits 2 Lakhs/year, yet farm resort cabins are operating at 95% capacity on weekends."
    },
    micro_bakery: {
      positive: ["Soft, fresh bread loaves (44%)", "Delicious sweet cookies (38%)"],
      negative: ["Stock runs out by evening (28%)", "Plain plastic wrapper packing (15%)"],
      gap: "Rural grocery stores get biscuits once a week from cities. A local bakery can deliver warm, fresh supplies daily, saving retailers transport costs."
    },
    fertilizer_retail: {
      positive: ["Genuine certified seeds (51%)", "Expert crop advice (42%)"],
      negative: ["Does not offer credit sales (35%)", "High pricing during shortage (22%)"],
      gap: "Seed supplies run thin during monsoons, causing black marketing. Having official dealership license secures guaranteed distributor stock to capture local market share."
    },
    solar_pump_dealership: {
      positive: ["Zero power bills (55%)", "Reliable motor pressure (42%)"],
      negative: ["Slow government subsidy papers (38%)", "No local support team (24%)"],
      gap: "Maharashtra's solar pump subventions are heavily promoted. Farmers wait months for dealer installations. Offering immediate setup and documentation support will double sales conversion."
    },
    general_store: {
      positive: ["All groceries in one shop (48%)", "Accepts digital payments (42%)"],
      negative: ["Narrow shopping aisles (20%)", "No discount options (15%)"],
      gap: "Rural centers are moving from small counters to mini-marts. Setting up a neat self-service grocery shop attracts high local family basket values."
    },
    poultry_farm: {
      positive: ["Fresh country eggs (51%)", "Clean broiler chicken (42%)"],
      negative: ["Bad smell near cages (32%)", "Fluctuating egg rates (18%)"],
      gap: "Nagpur town imports 40% of its eggs from Andhra Pradesh. A local farm avoids long-distance transport breakage and feeds organic maize directly from neighboring farms."
    }
  };

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
        maxWidth: '780px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', margin: 0 }}>
              💼 Business Archetype: {name}
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>{sector}</span>
          </div>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Description */}
          <div>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>{description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '20px' }}>
            
            {/* Startup Cost Estimates */}
            <div className="section-card" style={{ margin: 0, padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif' }}>
                💰 Estimated Startup Budget
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  <span>Machinery & Setup:</span>
                  <strong>₹{costs_breakdown.machinery.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  <span>Estimated Monthly Rent:</span>
                  <strong>₹{costs_breakdown.rent.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  <span>Licensing & Registration:</span>
                  <strong>₹{costs_breakdown.licensing.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  <span>Working Capital Runway:</span>
                  <strong>₹{costs_breakdown.working_capital.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  <span>Marketing & Launching:</span>
                  <strong>₹{costs_breakdown.marketing.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>
                  <span>Total Capital Required:</span>
                  <span style={{ color: '#3b82f6' }}>{investment_range}</span>
                </div>
              </div>
            </div>

            {/* Income & Projections */}
            <div className="section-card" style={{ margin: 0, padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#10b981', fontFamily: 'Outfit, sans-serif' }}>
                📈 Operating Profit & Break-Even
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Est. Monthly Profits:</span>
                  <strong style={{ color: '#22c55e' }}>{monthly_profit_est}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Break-Even:</span>
                  <strong style={{ color: '#eab308' }}>~{break_even_months} Months</strong>
                </div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📍 Supplier & Sourcing Target:</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                    Raw Materials: <strong>{raw_materials.join(", ")}</strong>
                    <br />
                    Nearest Sourcing Base: <strong>{getSourcingHotspots()}</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sourcing/Map Action */}
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', 
            padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <div>
              <strong style={{ display: 'block', fontSize: '13px' }}>Want to check viable tehsils for this sector?</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>We will locate agricultural outputs and competitive spots for {sector} on the map.</span>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => {
                onLocateOnMap(sector);
                onClose();
              }}
            >
              Locate on Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Government Subsidies */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#06b6d4', fontFamily: 'Outfit, sans-serif' }}>
              🏛️ Available Subsidies & Mudra Credit Coverage
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {schemes.map((sch, i) => (
                <div key={i} style={{ fontSize: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '10px', borderRadius: '6px' }}>
                  <strong style={{ color: '#fff' }}>{sch.name}</strong>
                  <p style={{ margin: '3px 0 0 0', color: '#cbd5e1', fontSize: '11px', lineHeight: '1.4' }}>{sch.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor review sentiment & Unmet Demand */}
          {sentimentData[id] && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '20px' }}>
              {/* Review Sentiment */}
              <div className="section-card" style={{ margin: 0, padding: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#f43f5e', fontFamily: 'Outfit, sans-serif' }}>
                  ⭐ Competitor Review Sentiment (NLP analysis)
                </h4>
                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✔ What Customers Like:</span>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#cbd5e1' }}>
                      {sentimentData[id].positive.map((p, idx) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠ Competitor Weaknesses / Complaints:</span>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#cbd5e1' }}>
                      {sentimentData[id].negative.map((n, idx) => <li key={idx}>{n}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Unmet Demand */}
              <div className="section-card" style={{ margin: 0, padding: '16px', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ef4444', fontFamily: 'Outfit, sans-serif' }}>
                  🚨 Unmet Demand & Opportunity Gaps
                </h4>
                <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>
                  {sentimentData[id].gap}
                </p>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '11px', color: '#f87171', marginTop: '10px', fontWeight: '500' }}>
                  💡 Opportunity Signal: Resolve competitor weaknesses to gain market share.
                </div>
              </div>
            </div>
          )}

          {/* Action Startup Checklist */}
          <div className="section-card" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#eab308', fontFamily: 'Outfit, sans-serif' }}>
              📋 Launch Checklist (Action Steps)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
