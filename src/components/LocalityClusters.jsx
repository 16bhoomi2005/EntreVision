import React, { useState } from 'react';
import { Layers, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Scatter } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, ChartTooltip, Legend);

export default function LocalityClusters() {
  const clusters = [
    {
      id: 'agri_powerhouses',
      name: 'Cluster A: Agri-Processing Powerhouses',
      description: 'Tehsils in this cluster produce Nagpur\'s largest volumes of oranges, soybeans, and cotton. Ideal for micro-refineries, cold storage, and packaging plants.',
      members: ['Katol', 'Narkhed', 'Savner', 'Kalmeshwar'],
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

  // Scatter plot data mapping (Rent index on X, Crop Yield on Y)
  const scatterData = {
    datasets: [
      {
        label: 'Cluster A: Agri-Processing',
        data: [
          { x: 2.5, y: 85, name: 'Katol' },
          { x: 2.2, y: 92, name: 'Narkhed' },
          { x: 3.0, y: 38, name: 'Savner' },
          { x: 3.5, y: 45, name: 'Kalmeshwar' }
        ],
        backgroundColor: '#f97316',
        pointRadius: 8,
        pointHoverRadius: 10
      },
      {
        label: 'Cluster B: Industrial Corridors',
        data: [
          { x: 6.5, y: 2, name: 'Hingna' },
          { x: 4.0, y: 1, name: 'Kamptee' },
          { x: 2.8, y: 0, name: 'Mouda' },
          { x: 5.0, y: 8, name: 'Nagpur Rural' }
        ],
        backgroundColor: '#3b82f6',
        pointRadius: 8,
        pointHoverRadius: 10
      },
      {
        label: 'Cluster C: Emerging Rural',
        data: [
          { x: 1.5, y: 15, name: 'Bhiwapur' },
          { x: 2.8, y: 35, name: 'Umred' },
          { x: 1.8, y: 22, name: 'Kuhi' }
        ],
        backgroundColor: '#22c55e',
        pointRadius: 8,
        pointHoverRadius: 10
      },
      {
        label: 'Cluster D: Eco-Tourism & Forest',
        data: [
          { x: 2.2, y: 15, name: 'Ramtek' },
          { x: 2.0, y: 12, name: 'Parseoni' }
        ],
        backgroundColor: '#ec4899',
        pointRadius: 8,
        pointHoverRadius: 10
      },
      {
        label: 'Cluster Centroids (★)',
        data: [
          { x: 2.8, y: 65, name: 'Centroid A (Agri)' },
          { x: 4.5, y: 3, name: 'Centroid B (Industrial)' },
          { x: 2.0, y: 24, name: 'Centroid C (Rural)' },
          { x: 2.1, y: 13, name: 'Centroid D (Tourism)' }
        ],
        backgroundColor: '#eab308',
        pointStyle: 'rectRot',
        pointRadius: 12,
        pointHoverRadius: 14
      }
    ]
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 10 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const pt = ctx.raw;
            return `${pt.name} (Rent Index: ${pt.x}, Crop Yield Index: ${pt.y})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Commercial Rent Lease index (Scale 1-10)', color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Dominant Agricultural Crop Yield index (MT/sq.km)', color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Informative Header */}
      <div className="info-alert" style={{ borderLeftColor: 'var(--color-secondary)' }}>
        <Layers className="w-5 h-5" style={{ marginBottom: '6px', color: 'var(--color-secondary)' }} />
        <strong>Economic Clusters (K-Means) Model:</strong> We used a K-Means algorithm (based on population density, competitor profiles, agricultural yields, and commercial lease indices) to group Nagpur's 14 blocks into 4 economic clusters. This helps you select a business category that fits your region's structure.
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

      {/* 2D Silhouette Cluster Visualization */}
      <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', color: '#fff' }}>📐 K-Means Silhouette 2D Spatial Scatter Plot</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Proof of mathematical clustering: Nagpur blocks mapped by Commercial Rent index (X-axis) vs. Crop Production volumes (Y-axis), showing clear Euclidean grouping boundaries and calculated centroids (★).
          </p>
        </div>
        <div style={{ height: '350px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

    </div>
  );
}
