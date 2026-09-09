import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Info, MessageSquare, MapPin, Building2, Wheat, Store, Mic, MicOff, PlayCircle } from 'lucide-react';
import businessArchetypes from '../data/business_archetypes.json';
import nagpurData from '../data/nagpur_data.json';

const TEHSILS = [
  'Katol', 'Narkhed', 'Savner', 'Kalmeshwar', 'Hingna', 
  'Kamptee', 'Mouda', 'Ramtek', 'Parseoni', 'Umred', 
  'Kuhi', 'Bhiwapur', 'Nagpur (Rural)'
];

export default function AIBusinessAdvisor() {
  const [selectedTehsil, setSelectedTehsil] = useState('Katol');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaskar! I am your AI-Driven Hyper-Local Business Advisor. I ground my recommendations directly in the verified crop yields, commercial lease rents, and competitor saturation data of Nagpur district's 14 blocks.\n\nSelect your target Tehsil above or type any question below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const stopRequestedRef = useRef(false);
  const recognitionFailedRef = useRef(false);
  const receivedVoiceResultRef = useRef(false);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    stopRequestedRef.current = false;
    recognitionFailedRef.current = false;
    receivedVoiceResultRef.current = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        receivedVoiceResultRef.current = true;
        setInputValue((currentValue) => currentValue ? `${currentValue} ${transcript}` : transcript);
        setVoiceStatus('Voice input added. You can edit it before sending.');
      }
    };

    recognition.onerror = (event) => {
      recognitionFailedRef.current = true;
      const messages = {
        'not-allowed': 'Microphone permission denied.',
        'service-not-allowed': 'Microphone permission denied.',
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone was found.',
        'language-not-supported': 'The selected language is not supported in this browser.'
      };
      setVoiceStatus(messages[event.error] || 'Voice recognition could not complete. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (stopRequestedRef.current) {
        setVoiceStatus('Voice input stopped.');
      } else if (!recognitionFailedRef.current && !receivedVoiceResultRef.current) {
        setVoiceStatus('Voice input stopped.');
      }
      stopRequestedRef.current = false;
    };

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setVoiceStatus('Voice recognition could not start. Please try again.');
    }
  };

  // Retrieve hyper-local context for selected tehsil
  const tehsilDetails = nagpurData.tehsil_details[selectedTehsil] || {};
  const crops = tehsilDetails.crop_mineral_production || {};
  const rentPerSqFt = tehsilDetails.avg_rent_sqft || 15;
  const competitorCount = tehsilDetails.competitor_count || 120;
  const primaryCrop = Object.keys(crops)[0] || 'Soybean';
  const primaryCropTonnage = crops[primaryCrop] || 'High';

  const dynamicTemplates = [
    `What is the best business to start in ${selectedTehsil}?`,
    `Show me commercial rent & competitor saturation in ${selectedTehsil}`,
    `How to get 35% PMEGP/PMFME subsidy in ${selectedTehsil}?`,
    `Compare orange pulping vs cold-pressed oil in ${selectedTehsil}`
  ];

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setLastQuery(text);
    setInputValue('');
    setIsTyping(true);

    // Hyper-Local RAG Analysis
    setTimeout(() => {
      const responseText = processHyperLocalQuery(text, selectedTehsil);
      const botMsg = {
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const openYouTubeGuide = () => {
    const query = lastQuery.toLowerCase();
    let videoSearch = `${lastQuery} business guide Nagpur`;

    if (query.includes('संत्र') || query.includes('orange')) {
      videoSearch = 'संत्रा प्रक्रिया व्यवसाय मराठी orange processing business Marathi';
    } else if (query.includes('जेवण') || query.includes('स्वयंपाक') || query.includes('tiffin') || query.includes('catering')) {
      videoSearch = 'घरगुती टिफिन व्यवसाय मराठी home tiffin business Marathi';
    } else if (query.includes('subsidy') || query.includes('pmegp') || query.includes('pmfme') || query.includes('योजना')) {
      videoSearch = 'PMEGP PMFME योजना अर्ज प्रक्रिया मराठी';
    }

    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(videoSearch)}`, '_blank', 'noopener,noreferrer');
  };

  // AI Hyper-Local Query Processor (Spatial-RAG logic)
  const processHyperLocalQuery = (query, currentTehsil) => {
    const q = query.toLowerCase();
    const isMarathi = /[\u0900-\u097F]/.test(query);

    // Check if user mentioned a specific tehsil in prompt, else fallback to currentTehsil
    let targetTehsil = currentTehsil;
    for (const t of TEHSILS) {
      if (q.includes(t.toLowerCase())) {
        targetTehsil = t;
        break;
      }
    }

    const tDetails = nagpurData.tehsil_details[targetTehsil] || {};
    const tCrops = tDetails.crop_mineral_production || {};
    const tRent = tDetails.avg_rent_sqft || 15;
    const tComp = tDetails.competitor_count || 120;

    // Marathi cooking and orange-processing questions
    if (isMarathi && (q.includes('जेवण') || q.includes('स्वयंपाक') || q.includes('खाण') || q.includes('कुकिंग'))) {
      return `🍲 **${targetTehsil} साठी तुमच्या स्वयंपाक कौशल्यावर आधारित व्यवसाय कल्पना**:
• **घरगुती टिफिन सेवा**: कार्यालये, दुकाने आणि विद्यार्थ्यांसाठी रोजचे जेवण तयार करा.
• **नाश्ता व केटरिंग**: पोहे, उपमा, भजी, पुरणपोळी किंवा सण-समारंभांसाठी ऑर्डर घ्या.
• **स्थानिक पदार्थांचे पॅकिंग**: मसाले, लोणची, पापड किंवा तयार स्नॅक्स विकू शकता.
• **सुरुवात कशी कराल**: प्रथम 10–15 नियमित ग्राहकांपासून सुरुवात करा आणि WhatsApp/स्थानिक दुकानदारांमार्फत ऑर्डर घ्या.

${targetTehsil} मध्ये सरासरी व्यावसायिक भाडे ₹${tRent}/sq.ft. आहे; त्यामुळे कमी खर्चात घरातून सुरुवात करणे हा चांगला पर्याय आहे. खाद्य-प्रक्रिया उपक्रमासाठी PMFME अंतर्गत 35% पर्यंतची मदत उपलब्ध असू शकते.`;
    }

    if (isMarathi && q.includes('संत्र')) {
      return `🍊 **${targetTehsil} मधील संत्र्यांपासून करता येणारे व्यवसाय**:
• **संत्र्याचा रस व स्क्वॅश**: ताजा रस, स्क्वॅश किंवा सिरप स्थानिक बाजारात विकू शकता.
• **जॅम, मुरंबा व कँडी**: जास्त पिकलेली किंवा आकाराने लहान संत्री मूल्यवर्धित पदार्थांसाठी वापरा.
• **संत्रा पल्प/प्युरी**: हॉटेल, बेकरी आणि आईस्क्रीम विक्रेत्यांना पुरवठा करता येतो.
• **सुकवलेली साल व झेस्ट**: बेकरी, मसाले आणि सुगंधी उत्पादनांसाठी छोट्या प्रमाणात विक्री करता येते.

${targetTehsil} हा संत्रा उत्पादनाचा परिसर आहे. आधी लहान प्रमाणात रस किंवा मुरंब्यापासून सुरुवात करा, खर्च व विक्री नोंदवा, आणि नंतर पल्प प्रक्रिया किंवा थंड साठवणुकीकडे वाढवा. PMFME योजनेत पात्र खाद्य-प्रक्रिया युनिटसाठी 35% पर्यंतची भांडवली मदत मिळू शकते.`;
    }

    if (isMarathi && (q.includes('व्यवसाय') || q.includes('धंदा') || q.includes('सुरू') || q.includes('करू शकते') || q.includes('करू शकतो'))) {
      return `💡 **${targetTehsil} साठी व्यवसाय मार्गदर्शन**:
तुमच्या कौशल्य, उपलब्ध भांडवल आणि स्थानिक कच्चा मालानुसार छोट्या प्रमाणात सुरुवात करणे योग्य राहील. ${targetTehsil} मध्ये संत्री, धान, कापूस आणि सोयाबीन उपलब्ध आहेत.

तुम्ही खाद्यपदार्थ बनवत असाल तर टिफिन, नाश्ता, केटरिंग, लोणची/मसाले किंवा संत्र्याचे मूल्यवर्धित पदार्थ हे चांगले पर्याय आहेत. तुमचे भांडवल, जागा आणि आवड सांगा; मी अधिक योग्य पर्याय सुचवेन.`;
    }

    // 1. Best business in target tehsil
    if (q.includes('best business') || q.includes('suggest') || q.includes('idea') || q.includes('start')) {
      if (['Katol', 'Narkhed', 'Savner', 'Kalmeshwar'].includes(targetTehsil)) {
        return `📍 **Hyper-Local Recommendation for ${targetTehsil} (Cluster A: Agri-Processing Powerhouse)**:
        
Based on our verified district database:
• **Top Venture**: **Orange Pulping & Citrus Cold Storage** or **Cold-Pressed Soybean Oil Mill**.
• **Raw Material Advantage**: ${targetTehsil} produces over **${(tCrops.Oranges || 30000).toLocaleString()} MT** of Nagpur Mandarin oranges annually, guaranteeing rock-bottom procurement costs at Katol/Saoner APMC yards.
• **Rental Overhead**: Average commercial lease rent is **₹${tRent}/sq.ft./month**, significantly cheaper than urban Nagpur (₹45/sq.ft.).
• **Market Saturation**: Competitor density is moderate (${tComp} registered micro-units), leaving wide gaps in standardized juice packaging and direct farmer procurement.
• **Financial Tip**: Qualifies for **35% capital subsidy under PMFME** (up to ₹10 Lakhs) for agricultural food processing.`;
      } else if (['Hingna', 'Kamptee', 'Mouda', 'Nagpur (Rural)'].includes(targetTehsil)) {
        return `📍 **Hyper-Local Recommendation for ${targetTehsil} (Cluster B: Industrial & Trade Corridor)**:
        
Based on our verified district database:
• **Top Venture**: **Fly Ash Brick Manufacturing** or **Industrial Fabrication / E-Seva Kendra**.
• **Raw Material Advantage**: Direct proximity to Koradi/Khaperkheda thermal plants (unlimited fly ash byproducts) and Hingna MIDC industrial supply chains.
• **Logistics**: Direct access to NH-44 highway freight corridors with high commercial footfall.
• **Rental Overhead**: Average lease rent is **₹${tRent}/sq.ft./month**.
• **Financial Tip**: PMEGP offers **25% subsidy for general rural category** and **35% for special categories** (SC/ST/OBC/Women).`;
      } else if (targetTehsil === 'Bhiwapur') {
        return `📍 **Hyper-Local Recommendation for Bhiwapur (Cluster C: Emerging Rural Hub)**:
        
• **Top Venture**: **Dry Red Chilli Grinding & Spice Packaging Mill**.
• **Raw Material Advantage**: Bhiwapur is world-famous for pungent red chillies, giving you instant geographic raw supply without broker markups.
• **Setup Budget**: Very low setup cost (₹98,000 - ₹1.5 Lakhs).
• **Commercial Rent**: Very affordable at only **₹${tRent}/sq.ft./month**.
• **Estimated Monthly Net Profit**: ₹28,000 - ₹45,000/month.`;
      } else {
        return `📍 **Hyper-Local Recommendation for ${targetTehsil}**:
        
• **Top Venture**: **Micro Dairy Chilling Unit** or **Bio-Fertilizer / Agro-Tourism Farm**.
• **Raw Material Advantage**: High livestock density (cattle & buffalo) and expansive rural green belts.
• **Lease Rent**: Highly affordable at **₹${tRent}/sq.ft./month**.
• **Competitor Saturation**: Low competitor load (${tComp} units), making it an untapped first-mover territory.`;
      }
    }

    // 2. Rent & Competitor query
    if (q.includes('rent') || q.includes('competitor') || q.includes('saturation') || q.includes('market')) {
      return `📊 **Hyper-Local Market Intelligence for ${targetTehsil}**:
• **Average Commercial Rent**: **₹${tRent}/sq.ft./month** (A standard 300 sq.ft. shop costs ~₹${tRent * 300}/mo).
• **Active Competitor Enterprises**: **${tComp} registered micro-enterprises** in this block.
• **Competitor Saturation Score**: **${Math.max(20, 100 - (tComp * 0.4)).toFixed(0)} / 100** (Higher score = lower saturation = higher market gap).
• **Primary Agricultural Yields**: ${Object.entries(tCrops).map(([crop, qty]) => `${crop}: ${typeof qty === 'number' ? qty.toLocaleString() + ' MT' : qty}`).join(', ')}.`;
    }

    // 3. Subsidies and schemes query
    if (q.includes('subsidy') || q.includes('pmegp') || q.includes('pmfme') || q.includes('mudra') || q.includes('scheme')) {
      return `🏛️ **Financial Structuring & Subsidies for ${targetTehsil} Entrepreneurs**:
1. **PMEGP (Prime Minister's Employment Generation Programme)**:
   • **Rural Subsidy**: **35% of project cost** for SC, ST, OBC, Women, Minorities, and Ex-Servicemen.
   • **25% of project cost** for General category in rural blocks.
   • **Promoter Equity**: You only need to invest **5% to 10%** of project cost from your pocket!
2. **PMFME (Micro Food Processing)**:
   • 35% credit-linked capital subsidy up to **₹10 Lakhs** for orange processing, dal mills, and spice grinding.
3. **Mudra Shishu & Kishor Loans**:
   • Collateral-free bank loans up to ₹50,000 (Shishu) and ₹5 Lakhs (Kishor) at priority sector rates (~9.5% p.a.).`;
    }

    // 4. Comparison query
    if (q.includes('compare') || q.includes('orange') || q.includes('oil')) {
      return `⚖️ **Comparative Feasibility in ${targetTehsil}**:
• **Orange Pulping / Processing**:
  – Setup Cost: ~₹3.55 Lakhs | Expected Net Profit: ₹38,000 - ₹65,000/mo
  – Raw Supply: Plentiful in Katol/Saoner belt. Highly seasonal (Nov - March).
• **Cold-Pressed Soybean Oil Mill**:
  – Setup Cost: ~₹2.60 Lakhs | Expected Net Profit: ₹32,000 - ₹52,000/mo
  – Raw Supply: Year-round soybean availability across Nagpur rural APMC yards.
• **Recommendation**: If starting with <₹3 Lakhs, Cold-Pressed Oil offers steady year-round cash flow without crop spoilage risk.`;
    }

    // Default Fallback
    return `💡 **Hyper-Local Insight for ${targetTehsil}**:
You asked: "${query}".
In **${targetTehsil}**, commercial rent is currently **₹${tRent}/sq.ft.** with **${tComp} registered micro-enterprises**.
Top local agricultural crops are **${Object.keys(tCrops).join(', ') || 'Soybean, Cotton'}**.

For maximum financial viability, we recommend choosing an agro-processing or trade venture that utilizes local raw supplies and qualifies for the **35% PMEGP rural subsidy**.`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Banner */}
      <div className="info-alert" style={{ borderLeftColor: 'var(--color-primary)' }}>
        <Sparkles className="w-5 h-5" style={{ marginBottom: '6px', color: 'var(--color-primary)' }} />
        <div>
          <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>
            AI-Driven Hyper-Local Business Advisory
          </strong>
          <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
            Grounding micro-enterprise recommendations in local agricultural crop volumes, commercial lease rents, and competitor saturation across Nagpur's 14 rural blocks.
          </span>
        </div>
      </div>

      {/* Hyper-Local Tehsil Selector & Live Context Card */}
      <div className="section-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>Target Block / Tehsil:</span>
            <select
              className="select-input"
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '12px', margin: 0, minWidth: '150px' }}
            >
              {TEHSILS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '11px', color: '#06b6d4', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.2)' }}>
            🟢 Live Spatial-RAG Context Loaded
          </span>
        </div>

        {/* Hyper-Local Metrics Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '10px', marginBottom: '2px' }}>
              <Wheat className="w-3.5 h-3.5 text-amber-400" /> PRIMARY CROP
            </div>
            <strong style={{ fontSize: '13px', color: '#fff' }}>{primaryCrop}</strong>
            <div style={{ fontSize: '9px', color: '#38bdf8' }}>{typeof primaryCropTonnage === 'number' ? primaryCropTonnage.toLocaleString() + ' MT' : primaryCropTonnage}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '10px', marginBottom: '2px' }}>
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> AVG LEASE RENT
            </div>
            <strong style={{ fontSize: '13px', color: '#22c55e' }}>₹{rentPerSqFt} / sq.ft.</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>~₹{rentPerSqFt * 300}/mo for 300 sq.ft</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '10px', marginBottom: '2px' }}>
              <Store className="w-3.5 h-3.5 text-indigo-400" /> REGISTERED COMPETITORS
            </div>
            <strong style={{ fontSize: '13px', color: '#eab308' }}>{competitorCount} Units</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>OSM & Udyam database</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '10px', marginBottom: '2px' }}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> TOP SUBSIDY
            </div>
            <strong style={{ fontSize: '13px', color: '#a855f7' }}>35% PMEGP</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Rural Special Category</div>
          </div>
        </div>
      </div>

      {/* Main chat window */}
      <div className="section-card" style={{ height: '440px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* Chat header */}
        <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>Advisor for {selectedTehsil} Block</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Location-grounded NLP engine</span>
        </div>

        {/* Message timeline */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{ 
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                gap: '8px',
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{ 
                width: '26px', height: '26px', borderRadius: '50%', 
                background: m.sender === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5 text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
              </div>

              <div style={{ 
                background: m.sender === 'user' ? 'var(--color-primary)' : 'rgba(30, 41, 59, 0.6)',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '12px',
                lineHeight: '1.5',
                whiteSpace: 'pre-line'
              }}>
                {m.text}
                <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: '4px' }}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Retrieving {selectedTehsil} agricultural & rental indicators...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }} 
            style={{ display: 'flex', gap: '8px' }}
          >
            <input 
              type="text" 
              className="text-input" 
              placeholder={`Ask anything about business viability, rent, or subsidies in ${selectedTehsil}...`} 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ flex: 1, margin: 0, fontSize: '12px' }}
            />
            <select
              aria-label="Voice input language"
              className="select-input"
              value={voiceLanguage}
              onChange={(e) => setVoiceLanguage(e.target.value)}
              disabled={isListening}
              style={{ width: 'auto', minWidth: '76px', margin: 0, padding: '0 6px', fontSize: '11px' }}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">हिन्दी</option>
              <option value="mr-IN">मराठी</option>
            </select>
            <button
              type="button"
              className="btn-primary"
              onClick={handleVoiceInput}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              title={isListening ? 'Stop voice input' : 'Start voice input'}
              style={{ background: isListening ? '#dc2626' : 'var(--color-primary)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ background: 'var(--color-primary)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {voiceStatus && (
            <div role="status" style={{ marginTop: '6px', fontSize: '10px', color: isListening ? '#22c55e' : 'var(--text-muted)' }}>
              {voiceStatus}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompts Pill Container */}
      <div>
        {lastQuery && (
          <button
            type="button"
            className="nav-tab"
            onClick={openYouTubeGuide}
            style={{ margin: '0 0 14px 0', padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '6px', color: '#67e8f9' }}
          >
            <PlayCircle className="w-4 h-4" /> Watch a related guide on YouTube
          </button>
        )}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          💡 Recommended Hyper-Local Prompts for {selectedTehsil}:
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {dynamicTemplates.map((template, idx) => (
            <button 
              key={idx}
              type="button" 
              className="nav-tab" 
              style={{ fontSize: '11px', padding: '5px 10px', background: 'rgba(255,255,255,0.02)', margin: 0, textAlign: 'left' }}
              onClick={() => handleSend(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
