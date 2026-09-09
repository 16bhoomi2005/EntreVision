import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Users, 
  Trophy, 
  Compass, 
  TrendingUp, 
  CircleDot,
  GitCompare,
  Home,
  BookOpen,
  HelpCircle,
  DollarSign,
  CloudSun,
  GraduationCap,
  TrendingDown,
  MessageSquare,
  Layers,
  Sliders,
  Folder,
  LogOut,
  User,
  Mic
} from 'lucide-react';

import MapComponent from './components/MapComponent';
import Recommendations from './components/Recommendations';
import Consultancy from './components/Consultancy';
import TehsilComparison from './components/TehsilComparison';
import FeasibilityReportModal from './components/FeasibilityReportModal';
import VentureWizard from './components/VentureWizard';
import BusinessDetailModal from './components/BusinessDetailModal';
import SchemesDirectory from './components/SchemesDirectory';
import MarketRates from './components/MarketRates';
import TrainingCenters from './components/TrainingCenters';
import WeatherAdvisory from './components/WeatherAdvisory';
import MethodologyPlayground from './components/MethodologyPlayground';
import LocalityClusters from './components/LocalityClusters';
import SavedPlans from './components/SavedPlans';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import ScenarioSimulator from './components/ScenarioSimulator';
import AIBusinessAdvisor from './components/AIBusinessAdvisor';

// Import Chart.js logic
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Import consolidated data
import rawNagpurData from './data/nagpur_data.json';

export default function App() {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'khoj' | 'recommend' | 'compare' | 'schemes' | 'consultancy' | 'stats' | 'about'
  const [nagpurData, setNagpurData] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedSector, setSelectedSector] = useState('Agriculture & Livestock');
  const [capitalSize, setCapitalSize] = useState('medium');
  const [recoLocations, setRecoLocations] = useState([]);

  // Modal State for AI Feasibility Report
  const [showReport, setShowReport] = useState(false);
  const [reportReco, setReportReco] = useState(null);

  // Business Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [liveAmenities, setLiveAmenities] = useState({ schools: null, colleges: null, hospitals: null, transport: null });
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  const renderSignInPrompt = (featureName) => (
    <div className="info-alert" style={{ maxWidth: '560px', margin: '48px auto', textAlign: 'center' }}>
      <User className="w-6 h-6 text-indigo-400" style={{ marginBottom: '10px' }} />
      <h2 style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px' }}>{featureName} requires an account</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 16px' }}>
        Sign in or create a free account to access this feature.
      </p>
      <button
        type="button"
        className="btn-primary"
        style={{ width: 'auto', padding: '9px 18px', margin: 0 }}
        onClick={() => setAuthModalOpen(true)}
      >
        Sign In / Create Account
      </button>
    </div>
  );

  const tehsilCoords = {
    Katol: { lat: 21.27, lon: 78.58 },
    Narkhed: { lat: 21.47, lon: 78.53 },
    Saoner: { lat: 21.38, lon: 78.92 },
    Kalmeshwar: { lat: 21.23, lon: 78.92 },
    Hingna: { lat: 21.06, lon: 78.97 },
    Bhiwapur: { lat: 20.76, lon: 79.52 },
    Umred: { lat: 20.85, lon: 79.33 },
    Kuhi: { lat: 21.01, lon: 79.36 },
    Ramtek: { lat: 21.40, lon: 79.33 },
    Parseoni: { lat: 21.38, lon: 79.20 },
    Mouda: { lat: 21.16, lon: 79.37 },
    Kamptee: { lat: 21.22, lon: 79.20 },
    "Nagpur Rural": { lat: 21.15, lon: 79.08 }
  };

  useEffect(() => {
    if (!selectedTehsil || !tehsilCoords[selectedTehsil]) {
      setLiveAmenities({ schools: null, colleges: null, hospitals: null, transport: null });
      return;
    }

    setLoadingAmenities(true);
    const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1' : '/api/v1';

    fetch(`${apiBase}/amenities?tehsil=${selectedTehsil}`)
      .then(res => res.json())
      .then(data => {
        setLiveAmenities({
          schools: data.schools,
          colleges: data.colleges,
          hospitals: data.hospitals,
          transport: data.transport
        });
        setLoadingAmenities(false);
      })
      .catch(err => {
        console.error("Failed fetching infrastructure amenities:", err);
        const details = nagpurData?.tehsil_details?.[selectedTehsil] || {};
        setLiveAmenities({
          schools: details.schools || 5,
          colleges: details.colleges || 2,
          hospitals: details.hospitals || 3,
          transport: details.transport || 4
        });
        setLoadingAmenities(false);
      });
  }, [selectedTehsil, nagpurData]);

  const handleLocateSectorOnMap = (sector) => {
    setSelectedSector(sector);
    setActiveTab('recommend');
  };

  useEffect(() => {
    setNagpurData(rawNagpurData);
  }, []);

  // Calculate Recommendations dynamically when sector or budget changes
  useEffect(() => {
    if (!nagpurData) return;

    const results = [];
    const details = nagpurData.tehsil_details || {};
    const stats = nagpurData.tehsil_stats || {};

    for (const [tehName, info] of Object.entries(details)) {
      const tehStats = stats[tehName] || { count: 0, categories: {} };
      const competitors = tehStats.categories[selectedSector] || 0;
      const totalTehBiz = tehStats.count || 1;

      let score = 55; // Base score

      // 1. Competitor Gap Analysis (lower ratio of competitors -> higher score)
      const competitorRatio = competitors / totalTehBiz;
      if (competitors === 0) {
        score += 25; // Perfect gap
      } else if (competitorRatio < 0.1) {
        score += 18;
      } else if (competitorRatio < 0.25) {
        score += 8;
      } else {
        score -= 15; // High competition
      }

      // 2. Rural Resource Alignment & Bumps
      const infoResources = info.resources || [];
      const prod = info.crop_mineral_production || { Oranges: 0, Paddy: 0, Cotton: 0, Soybean: 0, Coal: 0 };
      
      if (selectedSector === "Agriculture & Livestock") {
        if (info.type.includes("Rural")) {
          score += 25; // Large rural bonus
        }
        // Match specific rural agricultural crops & animal husbandry
        const agMatches = infoResources.filter(r => 
          r.includes("Orange") || r.includes("Cattle") || r.includes("Poultry") || 
          r.includes("Dairy") || r.includes("Agriculture") || r.includes("Soybean") || 
          r.includes("Chillies") || r.includes("Spices") || r.includes("Paddy")
        );
        score += agMatches.length * 10;

        // Direct crop production volume weight boost (max +20 points)
        const totalCropVol = prod.Oranges + prod.Paddy + prod.Cotton + prod.Soybean;
        score += Math.min(20, totalCropVol / 8000);
      } else if (selectedSector === "Manufacturing") {
        // High scores for Industrial MIDCs and Mining tehsils
        if (info.type.includes("Industrial") || info.resources.includes("Coal Mining")) {
          score += 25;
        }
        const manuMatches = infoResources.filter(r => 
          r.includes("Manufacturing") || r.includes("Engineering") || r.includes("Heavy Industry") || 
          r.includes("Textiles") || r.includes("Ginning") || r.includes("Mills") || r.includes("Steel")
        );
        score += manuMatches.length * 8;

        // Coal volume weight boost for factories / heavy industries (max +15 points)
        score += Math.min(15, (prod.Coal || 0) / 5000);
      } else if (selectedSector === "IT & Services") {
        if (info.type === "Urban") {
          score += 25; // Urban centers suit high-tech IT
        }
        const servMatches = infoResources.filter(r => 
          r.includes("IT") || r.includes("Financial") || r.includes("Services") || r.includes("Tourism")
        );
        score += servMatches.length * 10;
      } else if (selectedSector === "Retail & Trade") {
        if (info.type === "Urban" || info.type === "Suburban") {
          score += 15;
        }
        const retailMatches = infoResources.filter(r => 
          r.includes("Retail") || r.includes("Wholesale") || r.includes("Trading") || r.includes("Logistics")
        );
        score += retailMatches.length * 10;
      } else if (selectedSector === "Food & Hospitality") {
        if (info.resources.includes("Tourism") || info.resources.includes("Religious Tourism")) {
          score += 20; // Tourism hubs suit food/lodging
        }
        const foodMatches = infoResources.filter(r => 
          r.includes("Fruit") || r.includes("Processing") || r.includes("Spices") || r.includes("Tourism")
        );
        score += foodMatches.length * 10;
      }

      // 3. Capital & Real Estate Rent Fit Analysis
      const rentIndex = info.rent_index || 5.0;
      if (capitalSize === "low") {
        if (rentIndex <= 3.0) {
          score += 18;
        } else if (rentIndex > 6.0) {
          score -= 15;
        }
        if (info.type.includes("Rural")) {
          score += 10;
        }
      } else if (capitalSize === "medium") {
        if (rentIndex > 3.0 && rentIndex <= 6.0) {
          score += 10;
        } else if (rentIndex > 8.0) {
          score -= 10;
        }
      } else if (capitalSize === "high") {
        if (info.type.includes("Industrial") || info.type.includes("Mining")) {
          score += 15;
        }
        if (info.land_availability === "Very High" || info.land_availability === "High") {
          score += 12;
        }
      }

      // Normalize score
      const finalScore = Math.max(40, Math.min(99, score));

      // Explanations specific to Rural Nagpur resources
      let reason = "";
      if (selectedSector === "Agriculture & Livestock") {
        if (infoResources.includes("Mandarin Oranges")) {
          reason = `Prime citrus zone. High potential for establishing orange cold storages, citrus pulp processing units, or juice extraction centers close to Katol/Narkhed orchards.`;
        } else if (infoResources.includes("Bhiwapur Red Chillies")) {
          reason = `Famous for GI-tagged Bhiwapur Red Chillies. Excellent opportunity for spice crushing mills, chilli powder packaging, and wholesale trade.`;
        } else if (infoResources.includes("Dairy Farming") || infoResources.includes("Dairy Hub")) {
          reason = `High density of milch animals. Recommend establishing dairy collection centers, milk chillers, or organic paneer manufacturing units.`;
        } else if (infoResources.includes("Paddy (Rice) Mills")) {
          reason = `High paddy crop cultivation. Ideal for establishing modern rice mills, rice bran oil extraction, or organic agricultural inputs.`;
        } else {
          reason = `Rural agricultural area. Ideal for soybean processing mills, organic fertilizer units, or custom farming equipment hiring centers.`;
        }
      } else if (selectedSector === "Manufacturing") {
        reason = info.type.includes("Industrial")
          ? `Established industrial zone (${info.name}) with MIDC infrastructure, active engineering clusters, and cotton ginning mills.`
          : `Rural township. Suitable for micro-enterprise manufacturing, cotton handlooms, block printing, or fly-ash brick kilns.`;
      } else if (selectedSector === "IT & Services") {
        reason = info.type === "Urban"
          ? `Centralized metropolitan area with high literacy, rich infrastructure, and access to tech pools.`
          : `Rural block. Focus on setting up computerized common service centers (CSCs), agri-consultancies, or soil testing labs.`;
      } else if (selectedSector === "Retail & Trade") {
        reason = infoResources.some(r => r.includes("Trading") || r.includes("Wholesale") || r.includes("Logistics"))
          ? `High trade synergy. Close to regional crop markets (APMCs) and logistics hubs.`
          : `Rural market potential. Setting up farm input retail shops (fertilizers, seeds, machinery spares) shows high demand.`;
      } else if (selectedSector === "Food & Hospitality") {
        reason = infoResources.some(r => r.includes("Tourism"))
          ? `Tourism corridor. High potential for establishing local food stalls, roadside motels, or eco-resorts targeting travelers.`
          : `Suburban growth zone. Perfect for fruit-based processing kitchens or cottage sweets production.`;
      }

      results.push({
        tehsil: tehName,
        name: info.name,
        type: info.type,
        population: info.population,
        resources: infoResources,
        competitors: competitors,
        score: finalScore,
        reason: reason,
        rentIndex: rentIndex,
        landAvailability: info.land_availability || "Medium",
        cropMineralProduction: prod,
        avgRentPerSqft: info.avg_rent_per_sqft || 0,
        purchasingPowerIndex: info.purchasing_power_index || 50,
        mobilityIndex: info.mobility_index || 50,
        consumerDemandIndex: info.consumer_demand_index || 50,
        survivalIndex: info.survival_index || 50,
        schools: info.schools || 5,
        colleges: info.colleges || 1,
        hospitals: info.hospitals || 3,
        transport: info.transport || 1
      });
    }

    // Sort by score descending and take top 5
    const sorted = results.sort((a, b) => b.score - a.score).slice(0, 5);
    setRecoLocations(sorted);
    
    // Automatically select top recommended tehsil if none selected
    if (sorted.length > 0 && !selectedTehsil) {
      setSelectedTehsil(sorted[0].tehsil);
    }
  }, [nagpurData, selectedSector, capitalSize]);

  // Chart Data preparation
  const getLivestockChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    return {
      labels: ['Cattle', 'Buffalo', 'Bovine Units'],
      datasets: [
        {
          label: 'Nagpur Livestock Census',
          data: [
            nagpurData.livestock.cattle,
            nagpurData.livestock.buffalo,
            nagpurData.livestock.bovine_units
          ],
          backgroundColor: [
            '#22c55e',
            '#3b82f6',
            '#6366f1'
          ],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getPopulationChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    return {
      labels: ['Rural Population', 'Urban Population'],
      datasets: [
        {
          data: [nagpurData.population.rural.p, nagpurData.population.urban.p],
          backgroundColor: ['#10b981', '#3b82f6'],
          hoverBackgroundColor: ['#059669', '#2563eb'],
          borderColor: 'rgba(255,255,255,0.05)'
        }
      ]
    };
  };

  const getBusinessDistributionChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    
    const totals = {
      "Manufacturing": 0,
      "Retail & Trade": 0,
      "IT & Services": 0,
      "Food & Hospitality": 0,
      "Agriculture & Livestock": 0,
      "Other": 0
    };

    Object.values(nagpurData.tehsil_stats || {}).forEach(stats => {
      Object.entries(stats.categories || {}).forEach(([cat, val]) => {
        if (cat in totals) totals[cat] += val;
      });
    });

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          label: 'Registered Business Mix',
          data: Object.values(totals),
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(148, 163, 184, 0.7)'
          ],
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getRentChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    const labels = Object.keys(nagpurData.tehsil_details || {});
    const data = labels.map(label => nagpurData.tehsil_details[label].rent_index);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Commercial Rent Index (1-10)',
          data: data,
          backgroundColor: 'rgba(245, 158, 11, 0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getReligionChartData = () => {
    if (!nagpurData || !nagpurData.population?.religion) return { labels: [], datasets: [] };
    const religionData = nagpurData.population.religion;
    return {
      labels: Object.keys(religionData),
      datasets: [
        {
          data: Object.values(religionData),
          backgroundColor: [
            '#6366f1', // Hindu - Indigo
            '#22c55e', // Buddhist - Green
            '#06b6d4', // Muslim - Cyan
            '#ef4444', // Christian - Red
            '#8b5cf6', // Sikh - Purple
            '#ec4899', // Jain - Pink
            '#94a3b8'  // Others - Slate
          ],
          borderColor: 'rgba(255,255,255,0.05)'
        }
      ]
    };
  };

  const getCropsChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    const labels = Object.keys(nagpurData.tehsil_details || {});
    
    const orangeData = labels.map(l => nagpurData.tehsil_details[l].crop_mineral_production?.Oranges || 0);
    const paddyData = labels.map(l => nagpurData.tehsil_details[l].crop_mineral_production?.Paddy || 0);
    const cottonData = labels.map(l => nagpurData.tehsil_details[l].crop_mineral_production?.Cotton || 0);
    const soybeanData = labels.map(l => nagpurData.tehsil_details[l].crop_mineral_production?.Soybean || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Oranges (MT)',
          data: orangeData,
          backgroundColor: 'rgba(249, 115, 22, 0.75)'
        },
        {
          label: 'Paddy (MT)',
          data: paddyData,
          backgroundColor: 'rgba(34, 197, 94, 0.75)'
        },
        {
          label: 'Cotton (MT)',
          data: cottonData,
          backgroundColor: 'rgba(59, 130, 246, 0.75)'
        },
        {
          label: 'Soybean (MT)',
          data: soybeanData,
          backgroundColor: 'rgba(234, 179, 8, 0.75)'
        }
      ]
    };
  };

  const getMarketQualityChartData = () => {
    if (!nagpurData) return { labels: [], datasets: [] };
    const labels = Object.keys(nagpurData.tehsil_details || {});
    
    const demand = labels.map(l => nagpurData.tehsil_details[l].consumer_demand_index || 0);
    const power = labels.map(l => nagpurData.tehsil_details[l].purchasing_power_index || 0);
    const survival = labels.map(l => nagpurData.tehsil_details[l].survival_index || 0);
    const mobility = labels.map(l => nagpurData.tehsil_details[l].mobility_index || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Consumer Demand',
          data: demand,
          backgroundColor: 'rgba(34, 197, 94, 0.7)'
        },
        {
          label: 'Purchasing Power',
          data: power,
          backgroundColor: 'rgba(59, 130, 246, 0.7)'
        },
        {
          label: 'Biz Survival Rate',
          data: survival,
          backgroundColor: 'rgba(234, 179, 8, 0.7)'
        },
        {
          label: 'Mobility/Footfall',
          data: mobility,
          backgroundColor: 'rgba(236, 72, 153, 0.7)'
        }
      ]
    };
  };

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION & STATIC DETAILS */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="logo-text">EntreVision</span>
        </div>

        <nav className="nav-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          <div style={{ padding: '0 12px 6px 12px', fontSize: '10px', fontWeight: 'bold', color: 'var(--color-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Citizen Services
          </div>

          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="w-4 h-4" /> Home Landing
          </button>

          <button 
            className={`nav-tab ${activeTab === 'khoj' ? 'active' : ''}`}
            onClick={() => setActiveTab('khoj')}
          >
            <Sparkles className="w-4 h-4" /> Venture Khoj (Start Here)
          </button>

          {user && (
            <button 
              className={`nav-tab ${activeTab === 'saved_plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved_plans')}
            >
              <Folder className="w-4 h-4" /> My Saved Plans
            </button>
          )}

          <button 
            className={`nav-tab ${activeTab === 'schemes' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemes')}
          >
            <BookOpen className="w-4 h-4" /> Loans & Subsidies Directory
          </button>

          <button 
            className={`nav-tab ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Sliders className="w-4 h-4" /> Financial Structuring Assistant
          </button>

          <button 
            className={`nav-tab ${activeTab === 'advisor' ? 'active' : ''}`}
            onClick={() => setActiveTab('advisor')}
          >
            <MessageSquare className="w-4 h-4" /> AI Hyper-Local Advisor
          </button>

          <button 
            className={`nav-tab ${activeTab === 'success' ? 'active' : ''}`}
            onClick={() => setActiveTab('success')}
          >
            <Trophy className="w-4 h-4" /> Success Stories
          </button>

          <button 
            className={`nav-tab ${activeTab === 'consultancy' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultancy')}
          >
            <Users className="w-4 h-4" /> Ask a Local Expert
          </button>

          <button 
            className={`nav-tab ${activeTab === 'rates' ? 'active' : ''}`}
            onClick={() => setActiveTab('rates')}
          >
            <DollarSign className="w-4 h-4" /> Market Rates Today
          </button>

          <button 
            className={`nav-tab ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            <GraduationCap className="w-4 h-4" /> Training & Skill Centers
          </button>

          <button 
            className={`nav-tab ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            <CloudSun className="w-4 h-4" /> Weather & Crop Advisory
          </button>

          <div style={{ padding: '16px 12px 6px 12px', fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '8px' }}>
            Explore Data (Analysts)
          </div>

          <button 
            className={`nav-tab ${activeTab === 'locality' ? 'active' : ''}`}
            onClick={() => setActiveTab('locality')}
          >
            <Layers className="w-4 h-4" /> Economic Clusters (K-Means)
          </button>

          <button 
            className={`nav-tab ${activeTab === 'recommend' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommend')}
          >
            <Compass className="w-4 h-4" /> Explore by Region (Map)
          </button>

          <button 
            className={`nav-tab ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            <GitCompare className="w-4 h-4" /> Compare Tehsils
          </button>

          <button 
            className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 className="w-4 h-4" /> District Analytics
          </button>

          <button 
            className={`nav-tab ${activeTab === 'methodology' ? 'active' : ''}`}
            onClick={() => setActiveTab('methodology')}
          >
            <HelpCircle className="w-4 h-4" /> Interactive Methodology
          </button>
        </nav>

        {/* Dynamic Sidebar info panel */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {selectedTehsil && nagpurData?.tehsil_details?.[selectedTehsil] ? (
            <div className="section-card" style={{ background: 'rgba(99, 102, 241, 0.04)' }}>
              <span className="input-label" style={{ color: 'var(--color-secondary)' }}>Tehsil Spotlight</span>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '16px', margin: '4px 0' }}>
                {nagpurData.tehsil_details[selectedTehsil].name}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Population: <strong>{nagpurData.tehsil_details[selectedTehsil].population.toLocaleString()}</strong>
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <div className="stat-box" style={{ padding: '8px' }}>
                  <div className="stat-lbl" style={{ fontSize: '9px' }}>Type</div>
                  <div className="stat-val" style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>
                    {nagpurData.tehsil_details[selectedTehsil].type}
                  </div>
                </div>
                <div className="stat-box" style={{ padding: '8px' }}>
                  <div className="stat-lbl" style={{ fontSize: '9px' }}>Avg Rent</div>
                  <div className="stat-val" style={{ fontSize: '11px', color: '#f59e0b' }}>
                    ₹{nagpurData.tehsil_details[selectedTehsil].avg_rent_per_sqft}/sqft/mo
                  </div>
                </div>
              </div>

              {/* Public Facilities Counts */}
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <span className="input-label" style={{ fontSize: '9px', color: '#94a3b8' }}>Infrastructure Counts (OSM Real-time)</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '4px' }}>
                  <div className="stat-box" style={{ padding: '4px', textAlign: 'center' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Schools</div>
                    <strong style={{ fontSize: '11px', color: '#06b6d4' }}>
                      {loadingAmenities ? "..." : (liveAmenities.schools ?? nagpurData.tehsil_details[selectedTehsil].schools)}
                    </strong>
                  </div>
                  <div className="stat-box" style={{ padding: '4px', textAlign: 'center' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Colleges</div>
                    <strong style={{ fontSize: '11px', color: '#6366f1' }}>
                      {loadingAmenities ? "..." : (liveAmenities.colleges ?? nagpurData.tehsil_details[selectedTehsil].colleges)}
                    </strong>
                  </div>
                  <div className="stat-box" style={{ padding: '4px', textAlign: 'center' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Hospitals</div>
                    <strong style={{ fontSize: '11px', color: '#ef4444' }}>
                      {loadingAmenities ? "..." : (liveAmenities.hospitals ?? nagpurData.tehsil_details[selectedTehsil].hospitals)}
                    </strong>
                  </div>
                  <div className="stat-box" style={{ padding: '4px', textAlign: 'center' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Transit</div>
                    <strong style={{ fontSize: '11px', color: '#a855f7' }}>
                      {loadingAmenities ? "..." : (liveAmenities.transport ?? nagpurData.tehsil_details[selectedTehsil].transport)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Derived Proxy Market Indicators */}
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <span className="input-label" style={{ fontSize: '9px', color: '#94a3b8' }}>Derived Market Indicators</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                  <div className="stat-box" style={{ padding: '6px' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Consumer Demand</div>
                    <strong style={{ fontSize: '11px', color: '#22c55e' }}>{nagpurData.tehsil_details[selectedTehsil].consumer_demand_index}/100</strong>
                  </div>
                  <div className="stat-box" style={{ padding: '6px' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Purchasing Power</div>
                    <strong style={{ fontSize: '11px', color: '#3b82f6' }}>{nagpurData.tehsil_details[selectedTehsil].purchasing_power_index}/100</strong>
                  </div>
                  <div className="stat-box" style={{ padding: '6px' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Biz Survival Rate</div>
                    <strong style={{ fontSize: '11px', color: '#eab308' }}>{nagpurData.tehsil_details[selectedTehsil].survival_index}%</strong>
                  </div>
                  <div className="stat-box" style={{ padding: '6px' }}>
                    <div className="stat-lbl" style={{ fontSize: '8px' }}>Mobility/Footfall</div>
                    <strong style={{ fontSize: '11px', color: '#ec4899' }}>{nagpurData.tehsil_details[selectedTehsil].mobility_index}/100</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>Tehsil crop / livestock assets</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {nagpurData.tehsil_details[selectedTehsil].resources?.map((r, i) => (
                    <span 
                      key={i} 
                      className={`resource-badge ${nagpurData.tehsil_details[selectedTehsil].type.includes('Rural') ? 'agriculture' : nagpurData.tehsil_details[selectedTehsil].type.includes('Industrial') ? 'industrial' : ''}`}
                      style={{ fontSize: '9px', padding: '2px 6px' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {nagpurData.tehsil_details[selectedTehsil].crop_mineral_production && (
                <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span className="input-label" style={{ fontSize: '10px', color: '#c7d2fe' }}>Crop & Mineral Output</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {Object.entries(nagpurData.tehsil_details[selectedTehsil].crop_mineral_production).map(([key, val]) => {
                      if (val === 0) return null;
                      const maxVal = 100000;
                      const percent = Math.min(100, (val / maxVal) * 100);
                      const barColor = key === "Oranges" ? "#f97316" : key === "Paddy" ? "#22c55e" : key === "Cotton" ? "#3b82f6" : key === "Soybean" ? "#eab308" : "#94a3b8";
                      return (
                        <div key={key} style={{ fontSize: '11px', color: '#cbd5e1' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{key}</span>
                            <strong>{val.toLocaleString()} MT</strong>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: barColor, borderRadius: '2px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="info-alert" style={{ margin: 0 }}>
              Click any Tehsil circle marker on the map to explore local resources.
            </div>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="main-viewport">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="header-title">Nagpur rural Business Opportunity & Location Recommender</h1>
            <p className="header-subtitle">
              Analyzing Tehsil-level crop production, livestock density, and competitor clusters
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="resource-badge agriculture" style={{ margin: 0 }}>
              Rural Vidarbha Focus
            </span>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '4px 12px' }}>
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>
                  {user.user_metadata.display_name || user.email.split('@')[0]}
                </span>
                <button 
                  type="button" 
                  onClick={signOut}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '6px' }}
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary"
                style={{ 
                  fontSize: '11px', padding: '6px 14px', margin: 0, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', 
                  border: 'none', color: '#fff', borderRadius: '20px', cursor: 'pointer' 
                }}
                onClick={() => setAuthModalOpen(true)}
              >
                Sign In / Create Account
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        {activeTab === 'home' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Reframed Landing Pitch */}
              <div className="section-card" style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', 
                border: '1px solid rgba(99, 102, 241, 0.25)', 
                padding: '45px 30px', 
                textAlign: 'center', 
                borderRadius: '12px' 
              }}>
                <span className="resource-badge agriculture" style={{ fontSize: '11px', marginBottom: '12px', display: 'inline-block' }}>
                  Nagpur District Citizen Portal
                </span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', color: '#fff', margin: '0 0 10px 0', fontWeight: '800' }}>
                  What business should I start?
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  Based on real Nagpur district farm production, livestock, and commercial rents. Find the best business matching your savings and skills without competing with too many existing shops.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <button 
                    type="button"
                    className="btn-primary" 
                    style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px' }}
                    onClick={() => setActiveTab('khoj')}
                  >
                    <Sparkles className="w-5 h-5 text-white" /> Start Venture Khoj (Match My Savings)
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    aria-label="Ask the AI advisor by voice"
                    title="Ask the AI advisor by voice"
                    style={{ width: 'auto', padding: '14px 16px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.45)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                    onClick={() => user ? setActiveTab('advisor') : setAuthModalOpen(true)}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  ✔ Collateral-free loan matching &nbsp;|&nbsp; ✔ Mandi rate updates &nbsp;|&nbsp; ✔ ITI/KVK training center map &nbsp;|&nbsp; ✔ Local success stories
                </div>
              </div>

              {/* Citizen Services Fast Buttons */}
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', color: '#fff', margin: '0 0 16px 0' }}>Citizen Service Portals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  
                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('simulator')}>
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Financial Structuring Assistant</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>Auto-structure your capital stack (Equity vs PMEGP subsidies vs Bank loans), break-even targets, and loan DSCR.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('schemes')}>
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Loans & Subsidies</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>Find government schemes (MUDRA, PMEGP) that offer cash grants for new setups.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('success')}>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Success Stories</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>Read about neighboring business owners in Kuhi and Saoner who started recently.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('rates')}>
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Market Rates Today</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>View wholesale crop prices in local Nagpur mandis before buying raw material.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('training')}>
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Training Centers</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>Find government ITI and KVK classes nearby to learn computer, machinery, or farming skills.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('advisor')}>
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>AI Hyper-Local Advisor</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}><strong>(Spatial-RAG Engine)</strong> Grounded in local crop yields, commercial lease rents, and competitor counts of all 14 blocks.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('consultancy')}>
                    <Users className="w-5 h-5 text-indigo-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Ask a Local Expert</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}><strong>Talk to a real person</strong> — contact agricultural extension offices or partner with other local entrepreneurs.</p>
                  </div>

                  <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', padding: '20px' }} onClick={() => setActiveTab('weather')}>
                    <CloudSun className="w-5 h-5 text-amber-400" />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Weather & Crop Advisory</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>Read sowing advice and agricultural weather safety tips for your block.</p>
                  </div>
                </div>
              </div>

              {/* Research portal gateway */}
              <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', background: 'rgba(255,255,255,0.01)' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px' }}>Are you a researcher or business consultant?</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Explore our advanced GIS layers, tehsil comparison charts, and formula sliders.</p>
                </div>
                <button 
                  type="button" 
                  className="nav-tab" 
                  style={{ margin: 0, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setActiveTab('recommend')}
                >
                  <Compass className="w-4 h-4" /> Open Recommender Map
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'khoj' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <VentureWizard 
                onSelectBusiness={(biz) => {
                  setSelectedBusiness(biz);
                  setShowDetailModal(true);
                }} 
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'saved_plans' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <SavedPlans 
                onSelectBusiness={(biz) => {
                  setSelectedBusiness(biz);
                  setShowDetailModal(true);
                }} 
              />
            </div>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              {user ? <SchemesDirectory /> : renderSignInPrompt('Loans & Subsidies Directory')}
            </div>
          </div>
        )}

        {activeTab === 'success' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="section-card">
                <h3 className="panel-title" style={{ color: 'var(--color-secondary)' }}>
                  <Trophy className="w-5 h-5" /> Local Business Success Stories
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
                  Read about local entrepreneurs in Nagpur blocks who started their businesses with the help of district crop resources and government credit schemes.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  
                  {/* Case 1 */}
                  <div className="stat-box" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '15px', fontFamily: 'Outfit, sans-serif' }}>Ramesh Patil</h4>
                      <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>Kuhi block</span>
                    </div>
                    <span className="resource-badge agriculture" style={{ fontSize: '9px', width: 'fit-content' }}>Orange pulp Processing</span>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      "I had 2 acres of orange orchard but lost money due to transport delays. Using the regional crop data, I saw saoner was saturated but Kuhi was saturated with raw oranges without any processing plants. I took a <strong>₹5 Lakh Mudra Loan</strong> to buy pulping machinery and now supply pulp directly to beverage factories in Hingna MIDC. I broke even in just 8 months!"
                    </p>
                  </div>

                  {/* Case 2 */}
                  <div className="stat-box" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '15px', fontFamily: 'Outfit, sans-serif' }}>Sunita Deshmukh</h4>
                      <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>Bhiwapur block</span>
                    </div>
                    <span className="resource-badge industrial" style={{ fontSize: '9px', width: 'fit-content' }}>Chilli Grinding & Pack</span>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      "Bhiwapur is famous for dry chillies. I wanted to start a local spice mill but had limited savings. The <strong>PMFME scheme</strong> gave me a <strong>35% subsidy</strong> to purchase industrial spice grinders and heat sealers. Today, we package dry chilli powder under a local brand name and sell to retailers across Kamptee. It was simple once I followed the licensing checklist!"
                    </p>
                  </div>

                  {/* Case 3 */}
                  <div className="stat-box" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '15px', fontFamily: 'Outfit, sans-serif' }}>Amit Raut</h4>
                      <span className="resource-badge" style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>Narkhed block</span>
                    </div>
                    <span className="resource-badge" style={{ fontSize: '9px', width: 'fit-content', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>Solar equipment Store</span>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      "With frequent power cuts in villages, farmers in Narkhed needed solar water pumps for irrigation. I opened a small solar dealership with ₹3 Lakhs. By registering on the MahaDBT portal, I coordinate solar subsidies for orange and cotton growers, installing pumps on their farms. This tool showed Narkhed had the highest solar synergy rating."
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <MarketRates />
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <TrainingCenters />
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <WeatherAdvisory />
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <ScenarioSimulator />
            </div>
          </div>
        )}

        {activeTab === 'advisor' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              {user ? <AIBusinessAdvisor /> : renderSignInPrompt('AI Hyper-Local Advisor')}
            </div>
          </div>
        )}

        {activeTab === 'locality' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <LocalityClusters />
            </div>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <MethodologyPlayground nagpurData={nagpurData} />
            </div>
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="viewport-content">
            {/* Map Container */}
            <MapComponent 
              nagpurData={nagpurData} 
              selectedTehsil={selectedTehsil}
              setSelectedTehsil={setSelectedTehsil}
              selectedSector={selectedSector}
              recoLocations={recoLocations}
            />

            {/* Recommendation Filters Panel */}
            <section className="right-panel">
              <Recommendations 
                nagpurData={nagpurData}
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
                capitalSize={capitalSize}
                setCapitalSize={setCapitalSize}
                recoLocations={recoLocations}
                selectedTehsil={selectedTehsil}
                setSelectedTehsil={setSelectedTehsil}
                onGenerateReport={(reco) => {
                  setReportReco(reco);
                  setShowReport(true);
                }}
              />
            </section>
          </div>
        )}

        {activeTab === 'consultancy' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <Consultancy 
                nagpurData={nagpurData} 
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Rural Livestock and Population Aggregated Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                {/* Livestock Details */}
                {nagpurData?.livestock && (
                  <div className="section-card">
                    <h3 className="panel-title" style={{ color: 'var(--color-accent-orange)' }}>
                      <TrendingUp className="w-5 h-5" /> Nagpur Livestock Summary
                    </h3>
                    <div className="stats-grid">
                      <div className="stat-box">
                        <div className="stat-lbl">Total Cattle</div>
                        <div className="stat-val">{nagpurData.livestock.cattle.toLocaleString()}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">Total Buffalo</div>
                        <div className="stat-val">{nagpurData.livestock.buffalo.toLocaleString()}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">Livestock / sq.km</div>
                        <div className="stat-val">{nagpurData.livestock.density_per_sq_km}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">Vet Clinics / Lakh Animal</div>
                        <div className="stat-val">{nagpurData.livestock.vet_institutes_per_lakh}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Nagpur district contains over <strong>{nagpurData.livestock.bovine_units.toLocaleString()}</strong> bovine units. Agricultural areas like Kalmeshwar, Kamptee, and Savner show highly dense livestock populations, which are ideal locations for setting up cattle feed mills, veterinary supply retail, and automated dairy chilling plants.
                    </div>
                  </div>
                )}

                {/* Population aggregates */}
                {nagpurData?.population && (
                  <div className="section-card">
                    <h3 className="panel-title" style={{ color: 'var(--color-secondary)' }}>
                      <Users className="w-5 h-5" /> Nagpur District Demographics
                    </h3>
                    <div className="stats-grid">
                      <div className="stat-box">
                        <div className="stat-lbl">Census Population (2011)</div>
                        <div className="stat-val">{nagpurData.population.total.p.toLocaleString()}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">2026 Projected Pop</div>
                        <div className="stat-val" style={{ color: 'var(--color-secondary)' }}>
                          {nagpurData.population.projections["2026"].toLocaleString()}
                        </div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">Rural Pop Proportion</div>
                        <div className="stat-val">31.7%</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-lbl">Urban Pop Proportion</div>
                        <div className="stat-val">68.3%</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      While the urban population is high, Nagpur rural tehsils comprise a massive footprint of over <strong>{nagpurData.population.rural.hh.toLocaleString()}</strong> households. Main livelihood areas are agriculture (cotton, soybean, oranges) and mining (coal), offering a steady labor pool and raw materials.
                    </div>
                  </div>
                )}

              </div>

              {/* Graphic Charts Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginTop: '10px' }}>
                
                {/* Chart 1: Business Mix in Nagpur */}
                <div className="section-card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="panel-title" style={{ color: '#fff' }}>
                    <CircleDot className="w-4 h-4 text-indigo-400" /> Registered Sector-wise Business Mix (Udyam MSME Registry)
                  </h3>
                  <div style={{ height: '230px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Doughnut 
                      data={getBusinessDistributionChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: '#94a3b8',
                              font: { size: 10 }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.2', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                    *Data Source: Calculated from 8,000+ active enterprise registrations fetched directly from the Govt of India Udyam MSME Registry API (data.gov.in).
                  </div>
                </div>

                {/* Chart 2: Livestock Census distribution */}
                <div className="section-card" style={{ minHeight: '350px' }}>
                  <h3 className="panel-title" style={{ color: '#fff' }}>
                    <CircleDot className="w-4 h-4 text-green-400" /> Nagpur Livestock Census Distribution
                  </h3>
                  <div style={{ height: '260px' }}>
                    <Bar 
                      data={getLivestockChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Chart 3: Rural vs Urban Population Mix */}
                <div className="section-card" style={{ minHeight: '350px' }}>
                  <h3 className="panel-title" style={{ color: '#fff' }}>
                    <CircleDot className="w-4 h-4 text-green-400" /> Rural vs Urban Population Mix
                  </h3>
                  <div style={{ height: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Doughnut 
                      data={getPopulationChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: '#94a3b8',
                              font: { size: 10 }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Chart 4: Rent Index Breakdown */}
                <div className="section-card" style={{ minHeight: '350px' }}>
                  <h3 className="panel-title" style={{ color: '#fff' }}>
                    <CircleDot className="w-4 h-4 text-yellow-400" /> Average Commercial Lease Rate (₹/sq.ft.)
                  </h3>
                  <div style={{ height: '260px' }}>
                    <Bar 
                      data={getRentChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: { color: '#94a3b8', font: { size: 10 } }
                          }
                        },
                        scales: {
                          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 8 } } },
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="viewport-content" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ padding: '32px', overflowY: 'auto' }}>
              {user ? <TehsilComparison nagpurData={nagpurData} /> : renderSignInPrompt('Compare Tehsils')}
            </div>
          </div>
        )}
      </main>

      {/* AI Feasibility Report Modal */}
      <FeasibilityReportModal 
        show={showReport}
        onClose={() => setShowReport(false)}
        recommendation={reportReco}
        sector={selectedSector}
        capital={capitalSize}
      />

      {/* Business Archetype Detail Modal */}
      <BusinessDetailModal 
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        business={selectedBusiness}
        onLocateOnMap={handleLocateSectorOnMap}
        selectedTehsil={selectedTehsil}
      />

      {/* Supabase Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}
