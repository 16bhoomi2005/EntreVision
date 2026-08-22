import React, { useState, useEffect } from 'react';
import { Users, Send, Search, UserPlus, CheckCircle2, Phone, Mail, Landmark, MapPin } from 'lucide-react';

export default function Consultancy({ nagpurData }) {
  // Sample pre-populated peers in Nagpur Rural areas
  const defaultPeers = [
    {
      name: "Abhishek Patil",
      email: "abhishek.patil@email.com",
      sector: "Agriculture & Livestock",
      tehsil: "Katol",
      idea: "Orange juice processing & pulping unit using local farm-fresh Nagpur Mandarin oranges.",
      date: "2026-08-20"
    },
    {
      name: "Shreya Deshmukh",
      email: "shreya.d@email.com",
      sector: "Agriculture & Livestock",
      tehsil: "Kamptee",
      idea: "Organic dairy milk production and automated processing hub with veterinary support.",
      date: "2026-08-19"
    },
    {
      name: "Rohan Joshi",
      email: "rohan.joshi@email.com",
      sector: "IT & Services",
      tehsil: "Hingna",
      idea: "Farming machinery booking app for local tractors and harvesters.",
      date: "2026-08-21"
    },
    {
      name: "Nikita Sharma",
      email: "nikita.sharma@email.com",
      sector: "Food & Hospitality",
      tehsil: "Kalmeshwar",
      idea: "Citrus-based highway cafe and organic farm-to-table diner.",
      date: "2026-08-18"
    },
    {
      name: "Karan Malhotra",
      email: "karan.m@email.com",
      sector: "Manufacturing",
      tehsil: "Hingna",
      idea: "Small-scale automated cotton ginning & weaving unit.",
      date: "2026-08-15"
    },
    {
      name: "Pratiksha Shah",
      email: "pratiksha.s@email.com",
      sector: "Retail & Trade",
      tehsil: "Bhiwapur",
      idea: "B2B trading platform connecting chilli farmers directly to urban distributors.",
      date: "2026-08-22"
    }
  ];

  // Government Agriculture / Skill support contacts in Nagpur
  const governmentContacts = [
    {
      office: "Krishi Vigyan Kendra (KVK) Nagpur",
      tehsil: "Kalmeshwar",
      officer: "Dr. Sandip G. Patil (Chief Scientist)",
      phone: "+91 7118 275538",
      email: "kvknagpur@icar.gov.in",
      location: "CICR Campus, Wardha Road",
      helpText: "Contact for soil health cards, orange crop diseases, dairy farming training, and agriculture tool subsidies."
    },
    {
      office: "Taluka Agriculture Office Katol",
      tehsil: "Katol",
      officer: "Shri. R. K. Wankhede (TAO Officer)",
      phone: "+91 7112 222114",
      email: "tao.katol@maharashtra.gov.in",
      location: "APMC Market Yard, Katol",
      helpText: "Contact for orange nursery subventions, micro-drip irrigation subsidies, and PM-KISAN registrations."
    },
    {
      office: "Taluka Agriculture Office Bhiwapur",
      tehsil: "Bhiwapur",
      officer: "Shri. Manoj Kadam (TAO Officer)",
      phone: "+91 7115 288102",
      email: "tao.bhiwapur@maharashtra.gov.in",
      location: "Tehsil Compound, Bhiwapur",
      helpText: "Contact for Bhiwapur Dry Chilli crop incentives, PMFME food machinery subsidies, and organic farming clusters."
    },
    {
      office: "Govt Industrial Training Institute (ITI) Hingna",
      tehsil: "Hingna",
      officer: "Shri. Sunil Deshpande (Principal)",
      phone: "+91 7103 276088",
      email: "iti.hingna@maharashtra.gov.in",
      location: "MIDC Road, Hingna Town",
      helpText: "Contact for short-term courses on Tractor Mechanic, Solar PV Installer, and CNC Machine Operator."
    },
    {
      office: "Block Development Office (BDO) Saoner",
      tehsil: "Saoner",
      officer: "Shri. S. M. Raut (Block Officer)",
      phone: "+91 7113 236104",
      email: "bdo.saoner@nagpur.gov.in",
      location: "Panchayat Samiti, Saoner Town",
      helpText: "Contact for PMEGP rural loans, SHG women micro-finance subsidies, and rural cottage industry schemes."
    },
    {
      office: "District Industries Center (DIC) Nagpur Office",
      tehsil: "Kamptee",
      officer: "Smt. Nilima Rathod (General Manager)",
      phone: "+91 712 2532454",
      email: "gmdic.nagpur@maharashtra.gov.in",
      location: "Civil Lines, Nagpur (District Headquarter)",
      helpText: "Contact for Udyam Registrations, PM-Mudra collateral loans, and packaging/sorting cluster approvals."
    }
  ];

  const [activeSubTab, setActiveSubTab] = useState('peers'); // 'peers' | 'gov'
  const [peers, setPeers] = useState(() => {
    const saved = localStorage.getItem('entrevision_peers');
    return saved ? JSON.parse(saved) : defaultPeers;
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('Agriculture & Livestock');
  const [tehsil, setTehsil] = useState('Katol');
  const [idea, setIdea] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [matchedPeers, setMatchedPeers] = useState([]);
  const [filterTehsil, setFilterTehsil] = useState('All');

  useEffect(() => {
    localStorage.setItem('entrevision_peers', JSON.stringify(peers));
  }, [peers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !idea) return;

    const newPeer = {
      name,
      email,
      sector,
      tehsil,
      idea,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedPeers = [newPeer, ...peers];
    setPeers(updatedPeers);
    setSubmitted(true);

    // Calculate matches immediately
    const matches = peers.filter(p => p.sector === sector || p.tehsil === tehsil);
    setMatchedPeers(matches);

    // Reset form after a small delay
    setTimeout(() => {
      setName('');
      setEmail('');
      setIdea('');
    }, 4000);
  };

  // Filter peers based on search query
  const filteredPeers = peers.filter(p => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = (
      p.name.toLowerCase().includes(query) ||
      p.sector.toLowerCase().includes(query) ||
      p.tehsil.toLowerCase().includes(query) ||
      p.idea.toLowerCase().includes(query)
    );
    const matchesTehsil = filterTehsil === 'All' || p.tehsil === filterTehsil;
    return matchesSearch && matchesTehsil;
  });

  const filteredGovContacts = governmentContacts.filter(c => {
    return filterTehsil === 'All' || c.tehsil === filterTehsil;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Reframed Alert */}
      <div className="info-alert" style={{ borderLeftColor: 'var(--color-secondary)' }}>
        <Users className="w-5 h-5" style={{ marginBottom: '6px', color: 'var(--color-secondary)' }} />
        <strong>Ask a Local Expert & Peer Finder:</strong> Talk to government agronomists, training center supervisors, or connect with neighboring business owners in your block to coordinate packaging and supply routes.
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
        <button
          type="button"
          className={`nav-tab ${activeSubTab === 'peers' ? 'active' : ''}`}
          style={{ margin: 0 }}
          onClick={() => setActiveSubTab('peers')}
        >
          <Users className="w-4 h-4" /> Find a Business Partner / Local Peer
        </button>
        <button
          type="button"
          className={`nav-tab ${activeSubTab === 'gov' ? 'active' : ''}`}
          style={{ margin: 0 }}
          onClick={() => setActiveSubTab('gov')}
        >
          <Landmark className="w-4 h-4" /> Contact District Support Offices (KVK, TAO)
        </button>
      </div>

      {/* Tehsil filter for both views */}
      <div className="section-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Select your Taluka (Tehsil) to see contacts nearby:</span>
        <select
          className="select-input"
          value={filterTehsil}
          onChange={(e) => setFilterTehsil(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="All">All 14 Tehsils</option>
          <option value="Katol">Katol</option>
          <option value="Saoner">Saoner</option>
          <option value="Bhiwapur">Bhiwapur</option>
          <option value="Kuhi">Kuhi</option>
          <option value="Kalmeshwar">Kalmeshwar</option>
          <option value="Hingna">Hingna</option>
          <option value="Ramtek">Ramtek</option>
          <option value="Kamptee">Kamptee</option>
          <option value="Umred">Umred</option>
          <option value="Narkhed">Narkhed</option>
          <option value="Mouda">Mouda</option>
          <option value="Parseoni">Parseoni</option>
        </select>
      </div>

      {activeSubTab === 'peers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Registration Form */}
          <div className="section-card" style={{ height: 'fit-content' }}>
            <h3 className="panel-title" style={{ color: '#c7d2fe' }}>
              <UserPlus className="w-5 h-5 text-indigo-400" /> Share Your Business Idea
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Add your name and business idea so other local entrepreneurs in Nagpur rural can view and contact you to partner.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 className="w-12 h-12 text-green-400" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ color: '#fff', marginBottom: '8px' }}>Registered Successfully!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                  Your idea is now visible in the directory.
                </p>
                {matchedPeers.length > 0 && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'left' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                      Other peers with similar interests:
                    </span>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '12px', color: '#cbd5e1' }}>
                      {matchedPeers.slice(0, 3).map((match, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>
                          <strong>{match.name}</strong> doing <em>{match.sector}</em> in {match.tehsil}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button 
                  className="btn-primary" 
                  style={{ marginTop: '15px', width: 'auto', padding: '8px 16px' }}
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Idea
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="filter-group">
                <div>
                  <label className="input-label">Full Name</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Rajesh Kumar" 
                    required 
                  />
                </div>

                <div>
                  <label className="input-label">Phone or Email Address</label>
                  <input 
                    type="text" 
                    className="text-input" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="e.g. rajesh@email.com or 9890xxxxxx" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="input-label">Sector</label>
                    <select 
                      className="select-input" 
                      value={sector} 
                      onChange={(e) => setSector(e.target.value)}
                    >
                      <option value="Agriculture & Livestock">Agriculture & Livestock</option>
                      <option value="IT & Services">IT & Services</option>
                      <option value="Retail & Trade">Retail & Trade</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Food & Hospitality">Food & Hospitality</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Tehsil (Taluka)</label>
                    <select 
                      className="select-input" 
                      value={tehsil} 
                      onChange={(e) => setTehsil(e.target.value)}
                    >
                      {nagpurData?.tehsil_details && Object.keys(nagpurData.tehsil_details).map((teh) => (
                        <option key={teh} value={teh}>{teh}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">Describe your business plan</label>
                  <textarea 
                    className="text-input" 
                    value={idea} 
                    onChange={(e) => setIdea(e.target.value)} 
                    placeholder="E.g., I want to purchase sorting machinery and package raw oranges directly from orchards..." 
                    rows="3"
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send className="w-4 h-4" /> Share My Idea & Find Partners
                </button>
              </form>
            )}
          </div>

          {/* List of Peers */}
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 className="panel-title" style={{ margin: 0, color: '#c7d2fe' }}>
                <Users className="w-5 h-5 text-indigo-400" /> Active Peer Directory
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {filteredPeers.length} registered entries
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="text-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ideas by keywords..." 
                style={{ paddingLeft: '38px', fontSize: '13px' }}
              />
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredPeers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No peers listed in this block. Change Taluka filters above to expand.
                </div>
              ) : (
                filteredPeers.map((peer, index) => (
                  <div key={index} className="peer-card" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="peer-name" style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{peer.name}</span>
                      <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(99,102,241,0.1)' }}>
                        {peer.tehsil}
                      </span>
                    </div>
                    
                    <span className="resource-badge" style={{ 
                      fontSize: '8px',
                      backgroundColor: peer.sector === 'Agriculture & Livestock' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                      color: peer.sector === 'Agriculture & Livestock' ? '#22c55e' : '#06b6d4',
                      borderColor: 'transparent',
                      padding: '1px 6px',
                      marginBottom: '6px',
                      display: 'inline-block'
                    }}>
                      {peer.sector}
                    </span>

                    <p className="peer-idea" style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', margin: '4px 0 8px 0' }}>
                      "{peer.idea}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>Posted: {peer.date}</span>
                      <a 
                        href={peer.email.includes('@') ? `mailto:${peer.email}` : `tel:${peer.email}`}
                        className="peer-email"
                        style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold' }}
                      >
                        Contact Partner
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'gov' && (
        <div className="section-card">
          <h3 className="panel-title" style={{ color: '#c7d2fe' }}>
            <Landmark className="w-5 h-5 text-indigo-400" /> Rural Advisory & Support Offices Directory
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Reach out to Taluka Agriculture Officers, Krishi Vigyan Kendra agronomists, or Block Development Offices to get schemes paperwork started.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {filteredGovContacts.length === 0 ? (
              <div className="info-alert" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No specific support offices listed for this block. Select 'All 14 Tehsils' to see district hubs.
              </div>
            ) : (
              filteredGovContacts.map((contact, idx) => (
                <div 
                  key={idx} 
                  className="reco-card" 
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(30, 41, 59, 0.4)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ color: '#fff', fontSize: '15px', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{contact.office}</h4>
                    <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                      {contact.tehsil}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: '500' }}>
                    In-Charge: {contact.officer}
                  </div>

                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0', lineHeight: '1.4' }}>
                    {contact.helpText}
                  </p>

                  <div style={{ 
                    display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', 
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone className="w-3 h-3 text-slate-400" /> {contact.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail className="w-3 h-3 text-slate-400" /> {contact.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin className="w-3 h-3 text-slate-400" /> {contact.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
