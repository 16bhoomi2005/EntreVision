import requests
import json
import os
import math

# Define bounding box for Nagpur district [min_lat, min_lon, max_lat, max_lon]
bbox = "20.80,78.85,21.35,79.35"

# Overpass API URL
overpass_url = "https://overpass-api.de/api/interpreter"

# Overpass Query
overpass_query = f"""
[out:json][timeout:120];
(
  node["amenity"~"cafe|restaurant|bank|pharmacy|hospital|veterinary|clinic|marketplace"]({bbox});
  way["amenity"~"cafe|restaurant|bank|pharmacy|hospital|veterinary|clinic|marketplace"]({bbox});
  node["shop"~"supermarket|mall|clothes|bakery|convenience|department_store"]({bbox});
  way["shop"~"supermarket|mall|clothes|bakery|convenience|department_store"]({bbox});
  node["office"~"it|company|financial|telecommunication"]({bbox});
  way["office"~"it|company|financial|telecommunication"]({bbox});
  node["industrial"~"warehouse|factory"]({bbox});
  way["industrial"~"warehouse|factory"]({bbox});
);
out center;
"""

print("Sending request to Overpass API...")
try:
    headers = {
        "User-Agent": "EntreVisionPOICollector/1.0 (Bhoomi.Vaishya@desktop.com)"
    }
    response = requests.get(overpass_url, params={'data': overpass_query}, headers=headers, timeout=120)
    
    if response.status_code == 200:
        data = response.json()
        elements = data.get("elements", [])
        print(f"Successfully fetched {len(elements)} POIs from OpenStreetMap.")
        
        # Clean and simplify the elements
        cleaned_pois = []
        for el in elements:
            tags = el.get("tags", {})
            name = tags.get("name") or tags.get("brand") or "Local Business"
            
            # Extract coordinates
            lat = el.get("lat") or el.get("center", {}).get("lat")
            lon = el.get("lon") or el.get("center", {}).get("lon")
            
            if not lat or not lon:
                continue
                
            # Classify business category
            category = "Other"
            amenity = tags.get("amenity")
            shop = tags.get("shop")
            office = tags.get("office")
            industrial = tags.get("industrial")
            
            if amenity in ["cafe", "restaurant"]:
                category = "Food & Hospitality"
            elif amenity in ["bank", "marketplace"] or shop in ["supermarket", "mall", "clothes", "bakery", "convenience", "department_store"]:
                category = "Retail & Trade"
            elif amenity in ["hospital", "clinic", "veterinary"]:
                category = "IT & Services"  # Healthcare/Veterinary services
            elif office in ["it", "company", "financial", "telecommunication"]:
                category = "IT & Services"
            elif industrial in ["warehouse", "factory"]:
                category = "Manufacturing"
                
            cleaned_pois.append({
                "name": name,
                "lat": lat,
                "lon": lon,
                "category": category,
                "tags": {k: v for k, v in tags.items() if k in ["amenity", "shop", "office", "industrial", "brand", "cuisine"]}
            })
            
        # Save output
        output_path = r"C:\Users\Bhoomi Vaishya\OneDrive\Desktop\EntreVision\data\osm_pois.json"
        with open(output_path, "w") as f:
            json.dump(cleaned_pois, f, indent=2)
            
        print(f"Saved {len(cleaned_pois)} cleaned POIs to {output_path}")
        
    else:
        print(f"Error from Overpass API: {response.status_code}")
        print(response.text[:500])
except Exception as e:
    print(f"Exception querying Overpass API: {e}")
