# EntreVision - Nagpur Rural GIS-BI Citizen Portal & Decision System

EntreVision is a spatial planning and personalized business recommendation engine designed for rural Nagpur blocks. It integrates census demographics, wholesale mandi rates, infrastructure counts (schools, clinics, terminals), highway networks, and livestock databases to guide local entrepreneurs and consultants toward viable business setups while preventing market saturation.

---

## 🚀 How to Run the Project (For Team Collaborators)

To setup and run the application locally on your machine, follow these steps:

### Prerequisite
Ensure you have **Node.js** (v18 or above) installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repository.git
cd EntreVision
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open the URL printed in the terminal (typically `http://localhost:5173`) in your web browser.

### 4. Build for Production
To compile and optimize the app for staging/deployment:
```bash
npm run build
```
The output assets will be generated in the `dist/` directory.

---

## 👥 Git Collaboration Guidelines (Best Practices)

To work smoothly as a team and avoid merge conflicts, follow this Git workflow:

### 1. Keep your `main` branch clean
Never commit directly to `main`. The `main` branch should always represent working, deployable code.

### 2. Pull changes regularly
Before starting any new change, sync your local codebase with the latest remote changes:
```bash
git checkout main
git pull origin main
```

### 3. Create a Feature Branch
Create a separate branch for each feature or bugfix you are working on:
```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/mandi-rates-chart
```

### 4. Make commits and Push
Write descriptive commit messages:
```bash
git add .
git commit -m "feat: added mandi rates search filter to rates page"
git push origin feature/your-feature-name
```

### 5. Open a Pull Request (PR)
* Go to your repository on GitHub.
* Click **Compare & Pull Request**.
* Describe what changes you made and request review from your teammates.
* Once approved, merge it into `main`!

---

## 🗺️ Project Sitemap (14-Page Architecture)

The application separates concerns between rural citizens looking to start a shop and consultants researching district statistics:

### Section A: Citizen Services (For Local Entrepreneurs)
1.  **Home Page**: Simple, conversational entry focused on the call-to-action: *"What business should I start?"*.
2.  **Venture Khoj**: An intuitive quiz taking investment capability, risk thresholds, skills, and space, and outputting ranked business archetypes.
3.  **My Business Match Results**: Displays suited matches carrying setup cost alerts and profit estimates.
4.  **Business Idea Details**: Full spreadsheets of monthly operational costs, raw material suppliers, matched schemes, and a registration checklist with PDF export.
5.  **Loans & Subsidies Directory**: Simplified, applicant-centric filters for Mudra and PMEGP programs.
6.  **Success Stories**: High-trust case studies of neighboring entrepreneurs in Kuhi, Bhiwapur, and Narkhed.
7.  **Ask a Local Expert**: Unified portal with peer networking and a directory of Taluka Agriculture Officers and Krishi Vigyan Kendras (KVK).
8.  **Market Rates Today**: Wholesale Mandi crop/milk price boards across Nagpur APMC yards.
9.  **Training & Skill Centers**: Technical ITI courses directory by tehsil.
10. **Weather & Season Advisory**: Sowing calendars and treatments mapping temperature/humidity blocks.

### Section B: Explore Data (For Researchers & Admins)
11. **Explore by Region**: Leaflet interactive map displaying competitor pins and road network overlays.
12. **Compare Tehsils**: Side-by-side metric charts comparing multiple Nagpur blocks.
13. **District Analytics**: Aggregate demographic and livestock bar and doughnut charts.
14. **Interactive Methodology**: Features a live **Formula Tuning Lab** where sliders allow adjusting score variables to see rankings update, and a **JSON Schema Inspector**.

---

## 🛠️ Tech Stack & Libraries
*   **Core**: React, Vite
*   **Map Rendering**: Leaflet, React-Leaflet
*   **Charts**: Chart.js, React-Chartjs-2
*   **Icons**: Lucide React
*   **Data Compilation Pipeline**: Python (pandas, openpyxl)
