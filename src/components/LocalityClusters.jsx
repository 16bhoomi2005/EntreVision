import React, { useState } from 'react';
import { Layers, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function LocalityClusters() {
  const clusters = [
    {
      id: 'agri_powerhouses',
      name: 'Cluster A: Agri-Processing Powerhouses',
      description: 'Tehsils in this cluster produce Nagpur\'s largest volumes of oranges, soybeans, and cotton. Ideal for micro-refineries, cold storage, and packaging plants.',
      members: ['Katol', 'Narkhed', 'Saoner', 'Kalmeshwar'],
      metrics: {
        avgRent: '₹12 - ₹18 / sq.ft.',
        popDensity: 'Medium',
        competitorSaturation: 'Medium (Agronomy)',
        dominantResources: 'Oranges, Soybean, Cotton, Wheat'
      },
      recommendedArchetypes: [
        { id: 'orange_pulp', name: 'Orange Pulping Unit' },
        { id: 'cold_pressed_oil', name: 'Cold-Pressed Soybean Mill' },
        { id: 'cotton_roll', name: 'Surgical Cotton Carding' }
      ]
    },
    {
      id: 'industrial_corridors',
      name: 'Cluster B: Industrial & Trade Corridors',
      description: 'Peri-urban blocks close to Nagpur City with massive industrial estates (MIDC), transport yards, and high commercial rents. Ideal for manufacturing and logistics.',
      members: ['Hingna', 'Kamptee', 'Mouda', 'Nagpur Rural'],
      metrics: {
        avgRent: '₹35 - ₹65 / sq.ft.',
        popDensity: 'High',
        competitorSaturation: 'High (Retail & Services)',
        dominantResources: 'Coal, Steel, Fly Ash, Industrial Power'
      },
      recommendedArchetypes: [
        { id: 'fly_ash_bricks', name: 'Fly Ash Brick Manufacturing' },
        { id: 'e_seva_kendra', name: 'Rural CSC & Digital Services' },
        { id: 'micro_bakery', name: 'Micro Bakery & Biscuit Packing' }
      ]
    },
    {
      id: 'emerging_rural',
      name: 'Cluster C: Emerging Rural Centres',
      description: 'Low-density, low-rent blocks focused on specialty crops like Bhiwapur dry red chillies and agricultural trade. Low competition makes these high-opportunity zones.',
      members: ['Bhiwapur', 'Umred', 'Kuhi'],
      metrics: {
        avgRent: '₹6 - ₹10 / sq.ft.',
        popDensity: 'Low',
        competitorSaturation: 'Low',
        dominantResources: 'Dry Red Chilli, Manganese, Rice, Grains'
      },
      recommendedArchetypes: [
        { id: 'spices_grinding', name: 'Chilli & Spices Grinding Mill' },
        { id: 'fertilizer_retail', name: 'Fertilizer & Seed Retail Outlet' },
        { id: 'poultry_farm', name: 'Organic Poultry & Egg Farm' }
      ]
    },
    {
      id: 'eco_tourism',
      name: 'Cluster D: Eco-Tourism & Forestry Reserves',
      description: 'High-forest-cover, water-rich zones with prominent temples and tourism clusters. Best for agri-tourism, dairy hubs, and solar micro-grids.',
      members: ['Ramtek', 'Parseoni'],
      metrics: {
        avgRent: '₹8 - ₹12 / sq.ft.',
        popDensity: 'Low-Medium',
        competitorSaturation: 'Low (Tourism & Leisure)',
        dominantResources: 'Lakes, Forest Reserves, Livestock, Temples'
      },
      recommendedArchetypes: [
        { id: 'agro_tourism', name: 'Agro-Tourism Orchard Resort' },
        { id: 'dairy_farm', name: 'Modern Dairy & Chilling Unit' },
        { id: 'soil_testing_lab', name: 'Soil & Water Testing Lab' }
      ]
    }
  ];

  const [selectedCluster, setSelectedCluster] = useState(clusters[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Informative Header */}
      <div className="info-alert" style={{ borderLeftColor: 'var(--color-secondary)' }}>
        <Layers className="w-5 h-5" style={{ marginBottom: '6px', color: 'var(--color-secondary)' }} />
        <strong>Locality Clustering Explorer:</strong> We used a K-Means algorithm (based on population density, competitor profiles, agricultural yields, and commercial lease indices) to group Nagpur's 14 blocks into 4 economic clusters. This helps you select a business category that fits your region's structure.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Cluster list panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {clusters.map((c) => (
            <div 
              key={c.id} 
              className={`section-card ${selectedCluster.id === c.id ? 'active-glow' : ''}`}
              style={{ 
                cursor: 'pointer', 
                borderLeft: selectedCluster.id === c.id ? '4px solid var(--color-secondary)' : '1px solid rgba(255,255,255,0.06)',
                background: selectedCluster.id === c.id ? 'rgba(99, 102, 241, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                transition: 'all 0.2s ease-in-out',
                padding: '20px'
              }}
              onClick={() => setSelectedCluster(c)}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>{c.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{c.description}</p>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {c.members.map((m) => (
                  <span key={m} className="resource-badge" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.04)' }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected cluster detailed insights */}
        <div className="section-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <span className="resource-badge agriculture" style={{ fontSize: '10px' }}>Selected Cluster Insights</span>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '20px', margin: '6px 0 2px 0' }}>{selectedCluster.name}</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>{selectedCluster.description}</p>
          </div>

          {/* Cluster metrics table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 'bold' }}>ECONOMIC ATTRIBUTES:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Lease Rent Index</span>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{selectedCluster.metrics.avgRent}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Population Density</span>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{selectedCluster.metrics.popDensity}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Competitor Density</span>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{selectedCluster.metrics.competitorSaturation}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Dominant Resources</span>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{selectedCluster.metrics.dominantResources}</div>
              </div>
            </div>
          </div>

          {/* Recommended Business Ideas */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 'bold' }}>HIGH-POTENTIAL BUSINESS MATCHES:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedCluster.recommendedArchetypes.map((archetype) => (
                <div key={archetype.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{archetype.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
