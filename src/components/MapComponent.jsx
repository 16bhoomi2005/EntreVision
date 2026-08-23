import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';

// Helper component to handle center and zoom updates programmatically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

// Import generated GeoJSON
import tehsilGeoJSON from '../data/nagpur_tehsils.json';
import nagpurHighwaysJSON from '../data/nagpur_highways.json';

export default function MapComponent({ 
  nagpurData, 
  selectedTehsil, 
  setSelectedTehsil, 
  selectedSector, 
  recoLocations 
}) {
  const defaultCenter = [21.1466, 79.0882]; // Nagpur center
  const defaultZoom = 10;
  const geojsonRef = useRef(null);

  // Re-style GeoJSON features dynamically when selectedTehsil or selectedSector changes
  useEffect(() => {
    if (geojsonRef.current) {
      geojsonRef.current.eachLayer((layer) => {
        const tehName = layer.feature.properties.name;
        const style = getFeatureStyle(layer.feature);
        layer.setStyle(style);
      });
    }
  }, [selectedTehsil, selectedSector, recoLocations]);

  // Find map center based on selected tehsil
  const getMapCenter = () => {
    if (selectedTehsil && nagpurData?.tehsil_details?.[selectedTehsil]) {
      const teh = nagpurData.tehsil_details[selectedTehsil];
      return [teh.lat, teh.lon];
    }
    return defaultCenter;
  };

  const getMapZoom = () => {
    return selectedTehsil ? 11 : defaultZoom;
  };

  // Helper to color-code business categories
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Manufacturing': return '#6366f1'; // Indigo
      case 'Retail & Trade': return '#3b82f6'; // Blue
      case 'IT & Services': return '#06b6d4'; // Cyan
      case 'Food & Hospitality': return '#f97316'; // Orange
      case 'Agriculture & Livestock': return '#22c55e'; // Green
      default: return '#94a3b8';
    }
  };

  // Style function for tehsil boundary polygons
  const getFeatureStyle = (feature) => {
    const tehName = feature.properties.name;
    const isSelected = selectedTehsil === tehName;
    const rank = recoLocations.findIndex(r => r.tehsil === tehName);
    const isRecommended = rank !== -1;

    let fillColor = '#6366f1'; // Default Indigo
    if (isRecommended) {
      fillColor = rank === 0 ? '#22c55e' : rank === 1 ? '#06b6d4' : '#eab308'; // Green, Cyan, Yellow
    }

    return {
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.45 : 0.2,
      color: isSelected ? '#ffffff' : isRecommended ? fillColor : '#475569',
      weight: isSelected ? 3 : 1.5,
      dashArray: isSelected ? '0' : '3',
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  // Interactivity handlers for each polygon feature
  const onEachFeature = (feature, layer) => {
    const tehName = feature.properties.name;
    const details = nagpurData?.tehsil_details?.[tehName] || { type: 'Rural', population: 0, resources: [] };
    const stats = nagpurData?.tehsil_stats?.[tehName] || { count: 0, categories: {} };
    const competitorCount = stats.categories?.[selectedSector] || 0;

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 2.5,
          color: '#ffffff'
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        geojsonRef.current.resetStyle(layer);
        // maintain spotlight border
        const isSelected = selectedTehsil === tehName;
        if (isSelected) {
          layer.setStyle({
            weight: 3,
            color: '#ffffff',
            fillOpacity: 0.45
          });
        }
      },
      click: () => {
        setSelectedTehsil(tehName);
      }
    });

    // Create a rich popup
    const popupContent = `
      <div style="min-width: 190px; color: #fff; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; color: #fff; font-size: 15px;">
          ${tehName} Tehsil
        </h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #94a3b8;">
          Zone: <strong style="color: ${details.type.includes('Rural') ? '#22c55e' : '#06b6d4'};">${details.type}</strong>
        </p>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin: 3px 0;">
            <span>Population:</span>
            <strong style="color: #fff;">${details.population.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 3px 0;">
            <span>Avg Commercial Rent:</span>
            <strong style="color: #f59e0b;">₹${details.avg_rent_per_sqft || 0}/sq.ft.</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 3px 0;">
            <span>Schools & Colleges:</span>
            <strong style="color: #06b6d4;">${details.schools || 0} / ${details.colleges || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 3px 0;">
            <span>Hospitals & Clinics:</span>
            <strong style="color: #ef4444;">${details.hospitals || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 3px 0;">
            <span>Public Transit Hubs:</span>
            <strong style="color: #a855f7;">${details.transport || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 3px 0; color: #c7d2fe;">
            <span>${selectedSector} Competitors:</span>
            <strong>${competitorCount}</strong>
          </div>
          ${competitorCount === 0 ? `<div style="font-size: 8px; color: #eab308; margin-top: 2px; line-height: 1.2;">*Note: No active MSME registries or OSM tags recorded in this sector for ${tehName}. Ideal market entry opportunity.</div>` : ''}
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true}
        className="map-container"
      >
        <ChangeView center={getMapCenter()} zoom={getMapZoom()} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Draw Tehsil Boundary Polygons (GeoJSON) */}
        {nagpurData?.tehsil_details && (
          <GeoJSON 
            ref={geojsonRef}
            data={tehsilGeoJSON}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* 2. Draw Highway Network lines (GeoJSON) */}
        {nagpurHighwaysJSON && (
          <GeoJSON 
            data={nagpurHighwaysJSON}
            style={{ color: '#f59e0b', weight: 2.0, opacity: 0.6, dashArray: '1' }}
          />
        )}

        {/* 2. Render Business Samples for the selected Tehsil */}
        {selectedTehsil && nagpurData?.sample_businesses && 
          nagpurData.sample_businesses
            .filter(b => b.tehsil === selectedTehsil && (selectedSector === 'All' || b.category === selectedSector))
            .slice(0, 60)
            .map((biz, idx) => (
              <CircleMarker
                key={`biz-${idx}`}
                center={[biz.lat, biz.lon]}
                radius={6}
                fillColor={getCategoryColor(biz.category)}
                color="#fff"
                weight={1}
                fillOpacity={0.9}
              >
                <Popup>
                  <div style={{ fontSize: '12px' }}>
                    <h5 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '13px' }}>{biz.name}</h5>
                    <span 
                      style={{ 
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: getCategoryColor(biz.category) + '33',
                        color: getCategoryColor(biz.category),
                        marginBottom: '6px'
                      }}
                    >
                      {biz.category}
                    </span>
                    <p style={{ margin: 0, color: '#cbd5e1' }}>{biz.description}</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '10px', color: '#94a3b8' }}>
                      Data Source: {biz.date}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))
        }
      </MapContainer>
    </div>
  );
}
