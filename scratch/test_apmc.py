import requests
import json

url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a86454359441"
api_key = "579b464db66ec23bdd000001f0360705c7e6482d658b496162b419f4"

params = {
    "api-key": api_key,
    "format": "json",
    "limit": 10,
    "filters[state]": "Maharashtra",
    "filters[district]": "Nagpur"
}

try:
    print("Querying GOI APMC API...")
    res = requests.get(url, params=params, timeout=15)
    print(f"Status Code: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print("Columns / Keys in response:")
        print(data.keys())
        records = data.get("records", [])
        print(f"Total records fetched: {len(records)}")
        if records:
            print("Sample Record:")
            print(json.dumps(records[0], indent=2))
        else:
            print("No records found for Nagpur in today's daily feed.")
    else:
        print(res.text)
except Exception as e:
    print("Error:", e)
