import os
import json
import requests
import pandas as pd
import numpy as np
import math

# Define file paths
data_dir = r"C:\Users\Bhoomi Vaishya\OneDrive\Desktop\EntreVision\data"
output_dir = r"C:\Users\Bhoomi Vaishya\OneDrive\Desktop\EntreVision\src\data"

# Create output folder if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# 1. Read Population Excel File
population_file = os.path.join(data_dir, "population.xlsx")
pop_data = {}
if os.path.exists(population_file):
    try:
        df_pop = pd.read_excel(population_file)
        if len(df_pop) >= 3:
            pop_data = {
                "total": {"p": int(df_pop.loc[0, "TOT_P"]), "hh": int(df_pop.loc[0, "No_HH"])},
                "rural": {"p": int(df_pop.loc[1, "TOT_P"]), "hh": int(df_pop.loc[1, "No_HH"])},
                "urban": {"p": int(df_pop.loc[2, "TOT_P"]), "hh": int(df_pop.loc[2, "No_HH"])},
                "projections": {
                    "2011": 4653570,
                    "2021": 5220000,
                    "2026": 5420000,
                    "2031": 5520000
                },
                "religion": {
                    "Hindu": 75.04,
                    "Buddhist": 14.36,
                    "Muslim": 8.40,
                    "Christian": 0.74,
                    "Sikh": 0.44,
                    "Jain": 0.53,
                    "Others": 0.49
                }
            }
        print("Successfully read population aggregates.")
    except Exception as e:
        print(f"Error reading population file: {e}")

# 2. Read Livestock Excel Files
livestock_file = os.path.join(data_dir, "Nagpur_livestock.xlsx")
amount_file = os.path.join(data_dir, "Nagpur_amount.xlsx")
livestock_data = {}

if os.path.exists(livestock_file) and os.path.exists(amount_file):
    try:
        df_live = pd.read_excel(livestock_file)
        df_amt = pd.read_excel(amount_file)
        livestock_data = {
            "cattle": int(df_live.loc[0, "Cattle"]),
            "buffalo": int(df_live.loc[0, "Buffalo"]),
            "bovine_units": int(df_live.loc[0, "Bovine Unit"]),
            "density_per_sq_km": float(df_amt.loc[0, "Density of Livestock Population (per sq.km.)"]),
            "avg_per_village": float(df_amt.loc[0, "Average Livestock per Village"]),
            "vet_institutes_per_lakh": float(df_amt.loc[0, "No. of Veterinary Institute per lakh Livestock"])
        }
        print("Successfully read livestock data.")
    except Exception as e:
        print(f"Error reading livestock files: {e}")

# 3. Tehsil (Taluka) Details and Resource Mapping
tehsil_details = {
    "Bhiwapur": {
        "name": "Bhiwapur Tehsil", "lat": 20.7712, "lon": 79.5218, "type": "Rural", "population": 81519,
        "resources": ["Bhiwapur Red Chillies", "Spices Processing", "Cattle Farming", "Pulses Milling"],
        "rent_index": 1.5, "land_availability": "Very High",
        "crop_mineral_production": {"Oranges": 0, "Paddy": 28000, "Cotton": 8000, "Soybean": 15000, "Coal": 0}
    },
    "Hingna": {
        "name": "Hingna Tehsil", "lat": 21.0965, "lon": 78.9723, "type": "Semi-Urban / Industrial", "population": 242198,
        "resources": ["Cotton Cultivation", "MIDC Hingna", "Poultry Farms", "Heavy Engineering"],
        "rent_index": 6.5, "land_availability": "Medium",
        "crop_mineral_production": {"Oranges": 2000, "Paddy": 4000, "Cotton": 24000, "Soybean": 18000, "Coal": 0}
    },
    "Kalmeshwar": {
        "name": "Kalmeshwar Tehsil", "lat": 21.2291, "lon": 78.9224, "type": "Rural", "population": 122363,
        "resources": ["Orange Orchards", "Dairy Hub", "Food Processing", "Cold Storages"],
        "rent_index": 3.5, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 45000, "Paddy": 2000, "Cotton": 18000, "Soybean": 12000, "Coal": 0}
    },
    "Kamptee": {
        "name": "Kamptee Tehsil", "lat": 21.2255, "lon": 79.1994, "type": "Rural / Mining", "population": 238870,
        "resources": ["Dairy Farming", "Coal Mining", "Handlooms & Textiles", "Bricks Kiln"],
        "rent_index": 4.0, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 1000, "Paddy": 12000, "Cotton": 5000, "Soybean": 6000, "Coal": 45000}
    },
    "Katol": {
        "name": "Katol Tehsil", "lat": 21.2678, "lon": 78.5878, "type": "Rural", "population": 163808,
        "resources": ["Mandarin Oranges", "Citrus Processing", "Cotton Cultivation", "Fruit Packaging"],
        "rent_index": 2.5, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 85000, "Paddy": 1000, "Cotton": 32000, "Soybean": 14000, "Coal": 0}
    },
    "Kuhi": {
        "name": "Kuhi Tehsil", "lat": 21.0118, "lon": 79.3621, "type": "Rural", "population": 123977,
        "resources": ["Soybean Cultivation", "Paddy (Rice)", "Cattle Breeding", "Rural Tourism"],
        "rent_index": 1.8, "land_availability": "Very High",
        "crop_mineral_production": {"Oranges": 0, "Paddy": 42000, "Cotton": 6000, "Soybean": 22000, "Coal": 0}
    },
    "Mauda": {
        "name": "Mauda Tehsil", "lat": 21.1627, "lon": 79.3512, "type": "Rural", "population": 139776,
        "resources": ["Paddy (Rice) Mills", "Soybean Production", "Thermal Power", "Agriculture Machinery"],
        "rent_index": 2.8, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 0, "Paddy": 48000, "Cotton": 4000, "Soybean": 25000, "Coal": 0}
    },
    "Nagpur (Rural)": {
        "name": "Nagpur Rural Tehsil", "lat": 21.1800, "lon": 79.0300, "type": "Suburban", "population": 302195,
        "resources": ["Logistics Parks", "Warehousing", "Cotton Ginning", "Vegetable Supply Hub"],
        "rent_index": 5.0, "land_availability": "Medium-High",
        "crop_mineral_production": {"Oranges": 8000, "Paddy": 8000, "Cotton": 12000, "Soybean": 16000, "Coal": 0}
    },
    "Nagpur (Urban)": {
        "name": "Nagpur Urban", "lat": 21.1466, "lon": 79.0882, "type": "Urban", "population": 2405665,
        "resources": ["IT Parks", "Financial Services", "Retail Markets", "Consumer Goods"],
        "rent_index": 9.5, "land_availability": "Low",
        "crop_mineral_production": {"Oranges": 0, "Paddy": 0, "Cotton": 0, "Soybean": 0, "Coal": 0}
    },
    "Narkhed": {
        "name": "Narkhed Tehsil", "lat": 21.4727, "lon": 78.5332, "type": "Rural", "population": 147907,
        "resources": ["Mandarin Oranges", "Cold Chain Logistics", "Cotton Cultivation", "Organic Farming"],
        "rent_index": 2.2, "land_availability": "Very High",
        "crop_mineral_production": {"Oranges": 92000, "Paddy": 0, "Cotton": 35000, "Soybean": 10000, "Coal": 0}
    },
    "Parseoni": {
        "name": "Parseoni Tehsil", "lat": 21.3789, "lon": 79.1557, "type": "Rural / Mining", "population": 143019,
        "resources": ["Coal Reserves", "Forest Products", "Dairy Farming", "Eco Tourism"],
        "rent_index": 2.0, "land_availability": "Very High",
        "crop_mineral_production": {"Oranges": 12000, "Paddy": 9000, "Cotton": 8000, "Soybean": 9000, "Coal": 55000}
    },
    "Ramtek": {
        "name": "Ramtek Tehsil", "lat": 21.3969, "lon": 79.3278, "type": "Rural", "population": 158643,
        "resources": ["Religious Tourism", "Forest Reserves", "Rural Handicrafts", "Poultry Farming"],
        "rent_index": 2.2, "land_availability": "Very High",
        "crop_mineral_production": {"Oranges": 15000, "Paddy": 22000, "Cotton": 10000, "Soybean": 11000, "Coal": 20000}
    },
    "Savner": {
        "name": "Savner Tehsil", "lat": 21.3853, "lon": 78.9772, "type": "Rural / Mining", "population": 229450,
        "resources": ["Mandarin Oranges", "Coal Mining", "Cotton Processing", "Cattle Feed Mills"],
        "rent_index": 3.0, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 38000, "Paddy": 3000, "Cotton": 22000, "Soybean": 14000, "Coal": 30000}
    },
    "Umred": {
        "name": "Umred Tehsil", "lat": 20.8500, "lon": 79.3300, "type": "Rural", "population": 154180,
        "resources": ["Soybean Processing", "Coal Mining", "Agricultural Warehousing", "Dairy Processing"],
        "rent_index": 2.8, "land_availability": "High",
        "crop_mineral_production": {"Oranges": 3000, "Paddy": 15000, "Cotton": 15000, "Soybean": 35000, "Coal": 25000}
    }
}

# 4. Helper to find closest Tehsil based on coordinates
def find_closest_tehsil(lat, lon):
    min_dist = float('inf')
    closest_teh = "Nagpur (Rural)"
    for teh_name, details in tehsil_details.items():
        dist = math.sqrt((lat - details["lat"])**2 + (lon - details["lon"])**2)
        if dist < min_dist:
            min_dist = dist
            closest_teh = teh_name
    return closest_teh

# Helper to find closest Tehsil based on pincode mapping
pincode_to_tehsil = {
    "440001": "Nagpur (Urban)", "440010": "Nagpur (Urban)", "440015": "Nagpur (Rural)",
    "440022": "Nagpur (Urban)", "440024": "Nagpur (Urban)", "440008": "Nagpur (Urban)",
    "440012": "Nagpur (Urban)", "440013": "Nagpur (Urban)", "440014": "Nagpur (Urban)",
    "440016": "Hingna", "440030": "Nagpur (Urban)", "440034": "Nagpur (Rural)",
    "441108": "Kalmeshwar", "441110": "Kamptee", "441203": "Umred", "441122": "Hingna",
    "441104": "Umred"
}

def get_tehsil_for_record(pin_str, lat=None, lon=None):
    if lat and lon:
        return find_closest_tehsil(lat, lon)
    pin_cleaned = str(pin_str).strip()[:6]
    return pincode_to_tehsil.get(pin_cleaned, "Nagpur (Rural)")

# 5. Fetch Nagpur Business Registry Data
url = "https://api.data.gov.in/resource/8b68ae56-84cf-4728-a0a6-1be11028dea7"
api_key = "579b464db66ec23bdd000001f0360705c7e6482d658b496162b419f4"

print("Fetching business records from API...")
nagpur_businesses = []
limit = 1000
max_samples = 8000
offset = 0

for i in range(max_samples // limit):
    params = {
        "api-key": api_key, "format": "json", "limit": limit, "offset": offset, "filters[District]": "NAGPUR"
    }
    try:
        response = requests.get(url, params=params, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
        if response.status_code == 200:
            data = response.json()
            records = data.get("records", [])
            if not records:
                break
            nagpur_businesses.extend(records)
            print(f"Fetched offset {offset}, total records so far: {len(nagpur_businesses)}")
            if len(records) < limit:
                break
        else:
            break
    except Exception as e:
        break
    offset += limit

# 6. Process and Categorize Business Data
tehsil_aggregates = {}
for teh in tehsil_details.keys():
    tehsil_aggregates[teh] = {
        "count": 0,
        "categories": {
            "Manufacturing": 0,
            "Retail & Trade": 0,
            "IT & Services": 0,
            "Food & Hospitality": 0,
            "Agriculture & Livestock": 0,
            "Other": 0
        }
    }

processed_businesses = []

for record in nagpur_businesses:
    pin = str(record.get("Pincode") or "").strip()
    tehsil_name = get_tehsil_for_record(pin)
    
    tehsil_aggregates[tehsil_name]["count"] += 1
    
    activities_str = record.get("Activities") or "[]"
    activities = []
    try:
        activities = json.loads(activities_str)
    except:
        pass
        
    cat = "Other"
    description = ""
    if activities:
        description = activities[0].get("Description", "")
        desc_lower = description.lower()
        if any(w in desc_lower for w in ["manufacture", "production", "fabrication", "assembly", "textile", "engineering"]):
            cat = "Manufacturing"
        elif any(w in desc_lower for w in ["retail", "wholesale", "shop", "trade", "dealer", "sale", "store"]):
            cat = "Retail & Trade"
        elif any(w in desc_lower for w in ["software", "information technology", "computer", "consultancy", "service", "advertising", "education", "clinic"]):
            cat = "IT & Services"
        elif any(w in desc_lower for w in ["hotel", "restaurant", "cafe", "food", "catering", "sweet"]):
            cat = "Food & Hospitality"
        elif any(w in desc_lower for w in ["agriculture", "dairy", "farming", "poultry", "livestock", "veterinary", "milk", "seed"]):
            cat = "Agriculture & Livestock"
            
    tehsil_aggregates[tehsil_name]["categories"][cat] += 1
    
    # Save a clean sample of businesses
    if len(processed_businesses) < 1000:
        teh_coords = tehsil_details[tehsil_name]
        processed_businesses.append({
            "name": record.get("EnterpriseName") or "Unnamed Enterprise",
            "tehsil": tehsil_name,
            "lat": teh_coords["lat"] + np.random.uniform(-0.015, 0.015), # Jitter more since tehsils are larger
            "lon": teh_coords["lon"] + np.random.uniform(-0.015, 0.015),
            "category": cat,
            "description": description or "No description available",
            "date": record.get("RegistrationDate") or "N/A"
        })

# 7. Merge OSM POI Competitor Data
osm_file = os.path.join(data_dir, "osm_pois.json")
if os.path.exists(osm_file):
    try:
        with open(osm_file, "r") as f:
            osm_pois = json.load(f)
        print(f"Loading {len(osm_pois)} POIs from OSM...")
        
        osm_added = 0
        for poi in osm_pois:
            lat = poi.get("lat")
            lon = poi.get("lon")
            cat = poi.get("category", "Other")
            name = poi.get("name", "Local Business")
            
            # Map coordinates to closest tehsil
            tehsil_name = find_closest_tehsil(lat, lon)
            
            # Update stats
            tehsil_aggregates[tehsil_name]["count"] += 1
            tehsil_aggregates[tehsil_name]["categories"][cat] += 1
            
            # Add to map sample
            if osm_added < 800:
                processed_businesses.append({
                    "name": name,
                    "tehsil": tehsil_name,
                    "lat": lat,
                    "lon": lon,
                    "category": cat,
                    "description": f"OSM Competitor: {name}",
                    "date": "Live Data (OSM)"
                })
                osm_added += 1
        print(f"Merged OSM data: added {osm_added} POIs to sample list.")
    except Exception as e:
        print(f"Error merging OSM data: {e}")

# 8. Load and Merge Amenities Counts & Derived Proxy Metrics
amenities_counts = {}
amenities_file = os.path.join(output_dir, "osm_amenities_counts.json")
if os.path.exists(amenities_file):
    try:
        with open(amenities_file, "r") as f:
            amenities_counts = json.load(f)
        print("Loaded OSM structured amenities counts.")
    except Exception as e:
        print(f"Error reading amenities counts: {e}")

# Update tehsil_details with new derived metrics
for name, info in tehsil_details.items():
    # Load amenities with baseline safety counts for sparse rural regions
    raw_counts = amenities_counts.get(name, {})
    info["schools"] = max(5, raw_counts.get("schools", 0))
    info["colleges"] = max(1, raw_counts.get("colleges", 0))
    info["hospitals"] = max(3, raw_counts.get("hospitals", 0))
    info["transport"] = max(1, raw_counts.get("transport", 0))
    
    # Calculate real commercial rent pricing (₹ / sq.ft. / month)
    # Rent index of 1.5 -> ₹18/sq.ft., 9.5 -> ₹118/sq.ft.
    rent_idx = info.get("rent_index", 5.0)
    info["avg_rent_per_sqft"] = round(rent_idx * 12.5)
    
    # Derived Proxy Indexes (0 - 100)
    # Purchasing Power (Income Index): depends on rent and block type
    inc = 40 + (rent_idx * 5.0)
    if info["type"] == "Urban":
        inc += 10
    elif "Industrial" in info["type"] or "Semi-Urban" in info["type"]:
        inc += 5
    info["purchasing_power_index"] = min(100, round(inc))
    
    # Mobility & Footfall Index: depends on transport nodes and block type
    mob = 35 + (info["transport"] * 1.5)
    if info["type"] == "Urban":
        mob += 40
    elif "Industrial" in info["type"] or "Semi-Urban" in info["type"]:
        mob += 20
    else:
        mob += 5
    info["mobility_index"] = min(100, round(mob))
    
    # Consumer Demand Index: depends on population density and purchasing power
    pop_factor = min(30, (info["population"] / 200000) * 3)
    dem = (info["purchasing_power_index"] * 0.5) + pop_factor + 15
    info["consumer_demand_index"] = min(100, round(dem))
    
    # Business Survival Index: negatively affected by competitor counts and overhead rent
    comp_count = tehsil_aggregates.get(name, {}).get("count", 50)
    surv = 92 - (rent_idx * 1.5) - (comp_count * 0.05)
    info["survival_index"] = max(45, min(95, round(surv)))

# Compile final consolidated data
consolidated_data = {
    "population": pop_data,
    "livestock": livestock_data,
    "tehsil_details": tehsil_details,
    "tehsil_stats": tehsil_aggregates,
    "sample_businesses": processed_businesses
}

# Write output to file
output_path = os.path.join(output_dir, "nagpur_data.json")
with open(output_path, "w") as f:
    json.dump(consolidated_data, f, indent=2)

print(f"Data processing complete! Output saved to: {output_path}")
