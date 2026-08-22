import requests

url = "https://api.data.gov.in/resource/8b68ae56-84cf-4728-a0a6-1be11028dea7"
api_key = "579b464db66ec23bdd000001f0360705c7e6482d658b496162b419f4"

nagpur_businesses = []
offset = 0
limit = 1000

while True:
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "offset": offset,
    }

    response = requests.get(
        url,
        params=params,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=30,
    )

    if response.status_code != 200:
        print("Error:", response.status_code)
        print(response.text[:500])
        break

    data = response.json()
    records = data.get("records", [])

    if not records:
        break

    for record in records:
        district = str(record.get("District") or "").strip().lower()
        if district == "nagpur":
            nagpur_businesses.append(record)

    if len(records) < limit:
        break

    offset += limit

print(f"Total Nagpur businesses: {len(nagpur_businesses)}")

for i, record in enumerate(nagpur_businesses[:20], 1):
    name = record.get("EnterpriseName") or record.get("Enterprise Name") or "N/A"
    print(f"\n{i}. Business Name: {name}")

    selected_fields = [
        "State",
        "District",
        "Pincode",
        "RegistrationDate",
        "CommunicationAddress",
        "Activities",
        "LG_ST_Code",
        "LG_DT_Code",
    ]

    for field in selected_fields:
        if field in record and record[field] not in (None, ""):
            print(f"   {field}: {record[field]}")

if len(nagpur_businesses) > 20:
    print(f"\nShowing first 20 of {len(nagpur_businesses)} Nagpur records.")

