import React, { useState } from 'react';
import { Search, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import trainingCenters from '../data/training_centers.json';

export default function TrainingCenters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('All');

  const tehsils = ['All', ...new Set(trainingCenters.map(center => center.tehsil))];

  const filteredCenters = trainingCenters.filter(center => {
    const matchesSearch = 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase())) ||
      center.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTehsil = selectedTehsil === 'All' || center.tehsil === selectedTehsil;
    return matchesSearch && matchesTehsil;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header Alert */}
      <div className="info-alert" style={{ borderLeftColor: '#06b6d4' }}>
        <GraduationCap className="w-5 h-5 text-cyan-400" style={{ marginBottom: '6px' }} />
        <strong>Training & Skill Centers Directory:</strong> Don't have the skills for the business you want to start? Contact the government ITIs or Krishi Vigyan Kendras (KVKs) listed below to enroll in technical trades or crop processing courses.
      </div>

      {/* 2. Filter options */}
      <div className="section-card">
        <h3 className="panel-title" style={{ color: '#fff' }}>
          🔍 Search Courses & Skill Centers
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
          
          {/* Keyword search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Search by course or center name</label>
            <div style={{ position: 'relative' }}>
              <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="text-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Electrician, Orange, ITI..."
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Tehsil filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="input-label" style={{ fontSize: '11px' }}>Select Taluka (Tehsil)</label>
            <select
              className="select-input"
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
            >
              {tehsils.map((t, idx) => (
                <option key={idx} value={t}>{t === 'All' ? 'All Nagpur Rural' : t}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 3. Output directory grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px' }}>
        {filteredCenters.length === 0 ? (
          <div className="info-alert" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No training centers match your filter. Select 'All Nagpur Rural' above.
          </div>
        ) : (
          filteredCenters.map((center, index) => (
            <div 
              key={index} 
              className="reco-card" 
              style={{ 
                padding: '20px', 
                background: 'rgba(30, 41, 59, 0.4)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              
              {/* Title Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>
                    {center.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Type: {center.type}</span>
                </div>
                <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  {center.tehsil}
                </span>
              </div>

              {/* Courses list */}
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                  AVAILABLE COURSES & TRADES:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {center.courses.map((course, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="resource-badge" 
                      style={{ 
                        fontSize: '9px', 
                        backgroundColor: 'rgba(255,255,255,0.04)', 
                        borderColor: 'rgba(255,255,255,0.08)',
                        color: '#cbd5e1',
                        padding: '2px 8px'
                      }}
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Address / Contact details block */}
              <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.06)', 
                paddingTop: '10px', 
                fontSize: '11px', 
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                  <span style={{ color: '#cbd5e1' }}>{center.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enquiries: <strong style={{ color: '#fff' }}>{center.contact}</strong></span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
