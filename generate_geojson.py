import json
import math
import os

# Coordinates of Nagpur tehsils
tehsil_centers = {
    "Bhiwapur": {"lat": 20.7712, "lon": 79.5218, "radius": 16},
    "Hingna": {"lat": 21.0965, "lon": 78.9723, "radius": 18},
    "Kalmeshwar": {"lat": 21.2291, "lon": 78.9224, "radius": 15},
    "Kamptee": {"lat": 21.2255, "lon": 79.1994, "radius": 16},
    "Katol": {"lat": 21.2678, "lon": 78.5878, "radius": 19},
    "Kuhi": {"lat": 21.0118, "lon": 79.3621, "radius": 18},
    "Mauda": {"lat": 21.1627, "lon": 79.3512, "radius": 17},
    "Nagpur (Rural)": {"lat": 21.1800, "lon": 79.0300, "radius": 14},
    "Nagpur (Urban)": {"lat": 21.1466, "lon": 79.0882, "radius": 8},
    "Narkhed": {"lat": 21.4727, "lon": 78.5332, "radius": 18},
    "Parseoni": {"lat": 21.3789, "lon": 79.1557, "radius": 16},
    "Ramtek": {"lat": 21.3969, "lon": 79.3278, "radius": 18},
    "Savner": {"lat": 21.3853, "lon": 78.9772, "radius": 17},
    "Umred": {"lat": 20.8500, "lon": 79.3300, "radius": 18}
}

def make_geodesic_polygon(lat, lon, radius_km):
    R = 6378.1  # Earth radius
    coords = []
    # 12 points for a smooth polygon
    for i in range(13):
        angle = math.radians(i * 30)
        d = radius_km / R
        
        lat_rad = math.radians(lat)
        lon_rad = math.radians(lon)
        
        new_lat = math.asin(math.sin(lat_rad) * math.cos(d) + math.cos(lat_rad) * math.sin(d) * math.cos(angle))
        new_lon = lon_rad + math.atan2(math.sin(angle) * math.sin(d) * math.cos(lat_rad), math.cos(d) - math.sin(lat_rad) * math.sin(new_lat))
        
        coords.append([math.degrees(new_lon), math.degrees(new_lat)])
    return [coords]

# Build GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": []
}

for idx, (name, details) in enumerate(tehsil_centers.items()):
    polygon = make_geodesic_polygon(details["lat"], details["lon"], details["radius"])
    feature = {
        "type": "Feature",
        "id": idx,
        "properties": {
            "name": name,
            "center": [details["lat"], details["lon"]]
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": polygon
        }
    }
    geojson["features"].append(feature)

output_dir = r"C:\Users\Bhoomi Vaishya\OneDrive\Desktop\EntreVision\src\data"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "nagpur_tehsils.json")

with open(output_path, "w") as f:
    json.dump(geojson, f, indent=2)

print(f"GeoJSON generated successfully and saved to {output_path}!")
