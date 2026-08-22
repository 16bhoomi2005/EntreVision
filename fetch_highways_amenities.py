import requests
import json
import os
import math

bbox = "20.80,78.85,21.35,79.35"
overpass_url = "https://overpass-api.de/api/interpreter"

# 1. Fetch Major Highways (motorway, trunk, primary)
highway_query = f"""
[out:json][timeout:90];
(
  way["highway"="motorway"]({bbox});
  way["highway"="trunk"]({bbox});
  way["highway"="primary"]({bbox});
);
out geom;
"""

print("Fetching highway geometries from Overpass API...")
highways_geojson = {
    "type": "FeatureCollection",
    "features": []
}

try:
    headers = {"User-Agent": "EntreVisionHighways/1.0 (Bhoomi.Vaishya@desktop.com)"}
    response = requests.get(overpass_url, params={'data': highway_query}, headers=headers, timeout=120)
    if response.status_code == 200:
        data = response.json()
        elements = data.get("elements", [])
        print(f"Fetched {len(elements)} highway elements.")
        
        for idx, el in enumerate(elements):
            if "geometry" in el:
                coords = [[pt["lon"], pt["lat"]] for pt in el["geometry"]]
                feature = {
                    "type": "Feature",
                    "id": idx,
                    "properties": {
                        "name": el.get("tags", {}).get("name", "Unnamed Highway"),
                        "ref": el.get("tags", {}).get("ref", "NH"),
                        "type": el.get("tags", {}).get("highway", "primary")
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coords
                    }
                }
                highways_geojson["features"].append(feature)
        
        # Save to src/data/nagpur_highways.json
        output_dir = r"C:\Users\Bhoomi Vaishya\OneDrive\Desktop\EntreVision\src\data"
        os.makedirs(output_dir, exist_ok=True)
        highway_path = os.path.join(output_dir, "nagpur_highways.json")
        with open(highway_path, "w") as f:
            json.dump(highways_geojson, f, indent=2)
        print(f"Highways saved to: {highway_path}")
    else:
        print(f"Error fetching highways: {response.status_code}")
except Exception as e:
    print(f"Exception fetching highways: {e}")

# 2. Fetch Structured Amenities (Schools, Hospitals, Colleges, Transport)
print("\nFetching structured counts of amenities (schools, hospitals, colleges, transport hubs)...")
amenities_query = f"""
[out:json][timeout:90];
(
  node["amenity"="school"]({bbox});
  node["amenity"="college"]({bbox});
  node["amenity"="university"]({bbox});
  node["amenity"="hospital"]({bbox});
  node["amenity"="clinic"]({bbox});
  node["amenity"="bus_station"]({bbox});
  node["railway"="station"]({bbox});
);
out;
"""

tehsil_centers = {
    "Bhiwapur": {"lat": 20.7712, "lon": 79.5218},
    "Hingna": {"lat": 21.0965, "lon": 78.9723},
    "Kalmeshwar": {"lat": 21.2291, "lon": 78.9224},
    "Kamptee": {"lat": 21.2255, "lon": 79.1994},
    "Katol": {"lat": 21.2678, "lon": 78.5878},
    "Kuhi": {"lat": 21.0118, "lon": 79.3621},
    "Mauda": {"lat": 21.1627, "lon": 79.3512},
    "Nagpur (Rural)": {"lat": 21.1800, "lon": 79.0300},
    "Nagpur (Urban)": {"lat": 21.1466, "lon": 79.0882},
    "Narkhed": {"lat": 21.4727, "lon": 78.5332},
    "Parseoni": {"lat": 21.3789, "lon": 79.1557},
    "Ramtek": {"lat": 21.3969, "lon": 79.3278},
    "Savner": {"lat": 21.3853, "lon": 78.9772},
    "Umred": {"lat": 20.8500, "lon": 79.3300}
}

# Initialize counts
tehsil_amenities = {name: {"schools": 0, "colleges": 0, "hospitals": 0, "transport": 0} for name in tehsil_centers}

try:
    response = requests.get(overpass_url, params={'data': amenities_query}, headers={"User-Agent": "EntreVisionAmenities/1.0"}, timeout=120)
    if response.status_code == 200:
        data = response.json()
        nodes = data.get("elements", [])
        print(f"Fetched {len(nodes)} amenity nodes.")
        
        for node in nodes:
            lat = node.get("lat")
            lon = node.get("lon")
            if not lat or not lon:
                continue
                
            # Classify amenity
            tags = node.get("tags", {})
            amenity_type = None
            if tags.get("amenity") == "school":
                amenity_type = "schools"
            elif tags.get("amenity") in ["college", "university"]:
                amenity_type = "colleges"
            elif tags.get("amenity") in ["hospital", "clinic"]:
                amenity_type = "hospitals"
            elif tags.get("amenity") == "bus_station" or tags.get("railway") == "station":
                amenity_type = "transport"
                
            if not amenity_type:
                continue
                
            # Match to nearest tehsil
            min_dist = float('inf')
            nearest_tehsil = None
            for name, center in tehsil_centers.items():
                dist = math.sqrt((lat - center["lat"])**2 + (lon - center["lon"])**2)
                if dist < min_dist:
                    min_dist = dist
                    nearest_tehsil = name
            
            if nearest_tehsil:
                tehsil_amenities[nearest_tehsil][amenity_type] += 1
                
        # Save structured counts to a temporary json so process_data.py can load it
        temp_path = os.path.join(output_dir, "osm_amenities_counts.json")
        with open(temp_path, "w") as f:
            json.dump(tehsil_amenities, f, indent=2)
        print(f"Structured amenities counts saved to: {temp_path}")
        
        print("\n=== Amenities Counts per Tehsil ===")
        for name, counts in tehsil_amenities.items():
            print(f"{name}: {counts}")
            
    else:
        print(f"Error fetching amenities: {response.status_code}")
except Exception as e:
    print(f"Exception fetching amenities: {e}")
