import React, { useState } from 'react';
import { Award, Landmark, Search, ExternalLink, Filter } from 'lucide-react';

export default function SchemesDirectory() {
  const [filterSector, setFilterSector] = useState('All');
  const [filterCapital, setFilterCapital] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const schemes = [
    {
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      agency: "Ministry of MSME (Govt of India)",
      subsidy: "Up to 35% of Project Capital",
      funding_range: "Up to ₹25 Lakhs (Service) / ₹50 Lakhs (Manufacturing)",
      eligibility: "Any individual over 18, VIII pass for projects > ₹5L (Service) / > ₹10L (Mfg)",
      sector: "Manufacturing",
      capital: "high",
      category: "All",
      link: "https://www.kviconline.gov.in/pmegpeportal/",
      description: "Credit-linked subsidy program targeting rural micro-enterprises to generate employment. Higher subsidy rates (35%) are offered in rural areas compared to urban sectors."
    },
    {
      name: "Pradhan Mantri MUDRA Yojana (Shishu, Kishor, Tarun)",
      agency: "Mudra Bank (Govt of India / SIDBI)",
      subsidy: "Collateral-free low-interest commercial credit",
      funding_range: "Shishu (up to ₹50k), Kishor (₹50k - ₹5L), Tarun (₹5L - ₹10L)",
      eligibility: "Non-farm micro units, retail shops, traders, and small workshops",
      sector: "Retail & Trade",
      capital: "medium",
      category: "All",
      link: "https://www.mudra.org.in/",
      description: "Provides loans for working capital and machinery purchases with no collateral security requirements. Ideal for local retailers, digital service centers, and small grinding mills."
    },
    {
      name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
      agency: "Ministry of Food Processing Industries (MoFPI)",
      subsidy: "35% credit-linked subsidy (Capped at ₹10 Lakhs)",
      funding_range: "Up to ₹10 Lakhs",
      eligibility: "Micro food processing units, self-help groups (SHGs), and co-operatives",
      sector: "Agriculture & Livestock",
      capital: "medium",
      category: "All",
      link: "https://pmfme.mofpi.gov.in/",
      description: "Financial, technical, and business support for establishing micro food businesses. Promotes regional specialties (such as orange pulping, soybean mills, and masala grinding in Nagpur)."
    },
    {
      name: "Maharashtra Package Scheme of Incentives (PSI 2019)",
      agency: "Directorship of Industries (Govt of Maharashtra)",
      subsidy: "100% electricity duty exemptions & basket incentives",
      funding_range: "Varies (Tax exemptions & duty waivers)",
      eligibility: "MSMEs registered in Nagpur district under Udyam",
      sector: "Manufacturing",
      capital: "high",
      category: "All",
      link: "https://di.maharashtra.gov.in/",
      description: "Offers fiscal incentives to industrial units set up in underdeveloped blocks. Nagpur is classified as an eligible zone, granting waivers for stamp duty and industrial power consumption."
    },
    {
      name: "Stand-Up India Scheme for Entrepreneurs",
      agency: "SIDBI / National Credit Guarantee",
      subsidy: "75% loan cover with lower interest margins",
      funding_range: "₹10 Lakhs - ₹1 Crore",
      eligibility: "At least one SC / ST or Woman entrepreneur per bank branch",
      sector: "IT & Services",
      capital: "high",
      category: "Women",
      link: "https://www.standupmitra.in/",
      description: "Facilitates bank loans to greenfield enterprises established by women or marginalized classes. Applies directly to digital services, IT support hubs, and medical centers."
    },
    {
      name: "Nagpur Orange Crop Subvention & Cold Chain Subsidy",
      agency: "Maharashtra State Agri Department",
      subsidy: "50% subvention on machinery and cold storage",
      funding_range: "Up to ₹5 Lakhs",
      eligibility: "Orange growers, FPOs, and processing setups in Katol/Narkhed/Saoner",
      sector: "Agriculture & Livestock",
      capital: "medium",
      category: "All",
      link: "https://krishi.maharashtra.gov.in/",
      description: "State-funded scheme to prevent orange crop wastage. Provides a 50% discount on purchasing fruit sorting/waxing lines and pre-cooling chilling rooms."
    },
    {
      name: "NABARD Agri-Clinic & Agri-Business Centers (ACABC)",
      agency: "NABARD (Govt of India)",
      subsidy: "36% - 44% capital subsidy on setup costs",
      funding_range: "Up to ₹20 Lakhs",
      eligibility: "Agriculture graduates, diploma holders, or allied science students",
      sector: "Agriculture & Livestock",
      capital: "high",
      category: "All",
      link: "https://www.agriclinics.net/",
      description: "Supports farming graduates to set up soil-testing labs, veterinary clinics, or pesticide retail stores. 36% subsidy for general category and 44% for women/SC/ST."
    }
  ];

  const filteredSchemes = schemes.filter(sch => {
    const sectorMatch = filterSector === 'All' || sch.sector === filterSector || sch.sector === 'All';
    const capitalMatch = filterCapital === 'All' || sch.capital === filterCapital;
    const categoryMatch = filterCategory === 'All' || sch.category === filterCategory || sch.category === 'All';
    return sectorMatch && capitalMatch && categoryMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      
      {/* Filtering Panels */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: 'var(--color-secondary)' }}>
          <Landmark className="w-5 h-5" /> Government Subsidies & Loans Directory
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Find active Central and Maharashtra State schemes mapping directly to your business profile, gender class, or capital size.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          
          {/* Sector filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Filter by Industry Sector</label>
            <select
              className="select-input"
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
            >
              <option value="All">All Industry Sectors</option>
              <option value="Agriculture & Livestock">Agriculture & Livestock</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="IT & Services">IT & Services</option>
              <option value="Retail & Trade">Retail & Trading</option>
            </select>
          </div>

          {/* Capital filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>How much funding support do you need?</label>
            <select
              className="select-input"
              value={filterCapital}
              onChange={(e) => setFilterCapital(e.target.value)}
            >
              <option value="All">Any Amount / No Preference</option>
              <option value="low">Micro Loan (Less than ₹2 Lakhs)</option>
              <option value="medium">Small Setup (₹2 Lakhs - ₹10 Lakhs)</option>
              <option value="high">Large Commercial (More than ₹10 Lakhs)</option>
            </select>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Who is applying for the loan?</label>
            <select
              className="select-input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">General Farmer / Resident</option>
              <option value="Women">Women Entrepreneur / Self-Help Group (SHG)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
        {filteredSchemes.length === 0 ? (
          <div className="info-alert" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', padding: '24px', textAlign: 'center', color: '#cbd5e1' }}>
            No government schemes match the selected filters. Reset filter drop-downs above.
          </div>
        ) : (
          filteredSchemes.map((sch, idx) => (
            <div 
              key={idx}
              className="reco-card" 
              style={{ padding: '20px', background: 'rgba(30, 41, 59, 0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>
                    {sch.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Funder: {sch.agency}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="resource-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.2)', fontSize: '10px' }}>
                    {sch.subsidy}
                  </span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>{sch.description}</p>

              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', 
                fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', marginTop: '4px' 
              }}>
                <div>
                  Funding Limit: <strong style={{ color: '#fff' }}>{sch.funding_range}</strong>
                </div>
                <div>
                  Key Eligibility: <strong style={{ color: '#fff' }}>{sch.eligibility}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <a 
                  href={sch.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '11px', color: 'var(--color-secondary)', textDecoration: 'none', 
                    display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' 
                  }}
                >
                  Official Scheme Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
