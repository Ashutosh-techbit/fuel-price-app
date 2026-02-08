# Fuel Price Analysis Dashboard

A modern, interactive dashboard for visualizing fuel prices (Petrol and Diesel) across India's major metro cities. Built with React, TypeScript, and Apache ECharts.

![Dashboard Screenshot](./screenshots/dashboard_light_theme.png)

## 🔗 Live Demo

**Live URL:** https://fuelpricesdashboard.netlify.app/

---

## 📊 Features

### Filter Controls
- **Metro City Selection:** Choose from Delhi, Mumbai, Chennai, or Kolkata
- **Fuel Type:** Toggle between Petrol and Diesel
- **Year Selection:** View data for any year from 2017-2025

### Key Statistics Cards
- **Yearly Average:** Average price across all months for selected filters
- **Highest Month:** Month with peak fuel prices
- **Lowest Month:** Month with minimum fuel prices
- **Price Range:** Spread between highest and lowest monthly averages

### Monthly Average RSP Bar Chart
- Interactive bar chart showing monthly price trends
- Gradient-filled bars with value labels
- Horizontal average reference line
- Tooltips with detailed price information

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Mantine UI** | Component Library |
| **Apache ECharts** | Data Visualization |
| **PapaParse** | CSV Parsing |

---

## 📁 Project Structure

```
fuel-price-app/
├── public/
│   └── data.csv              # Source data file (June 2017 - June 2025)
├── src/
│   ├── components/
│   │   ├── BarChart.tsx      # City comparison bar chart
│   │   ├── LineChart.tsx     # Monthly trends line chart
│   │   ├── MonthlyBarChart.tsx   # Monthly RSP bar chart (main view)
│   │   └── YearlyTrendChart.tsx  # Yearly average chart
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles (light theme)
│   ├── types.ts              # TypeScript interfaces & utility functions
│   ├── useLoadData.ts        # Custom hook for CSV data loading
│   ├── index.css             # Global styles
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite type declarations
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fuel-price-app.git
   cd fuel-price-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📈 Data Analysis Functions

The application includes several optimized data processing functions:

### `calculateMonthlyRSP(data, city, fuelType, year)`
- **Time Complexity:** O(n) - single pass through filtered data
- **Purpose:** Calculates monthly average RSP for a specific city/fuel/year
- **Uses:** Map for O(1) lookups during month-based aggregation



---

## 🎨 UI/UX Features

- **Light Theme:** Clean, professional design matching NITI Aayog / PPAC branding
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Interactive Filters:** Dropdown selectors for city, fuel type, and year
- **Statistics Cards:** At-a-glance view of key metrics with icons
- **Interactive Charts:** 
  - Tooltips with detailed price information
  - Gradient-filled bars for visual appeal
  - Average reference line for context
- **Loading States:** Smooth loading indicators
- **Error Handling:** Graceful error messages

---

## 📝 Data Source

Data sourced from:
**NITI Aayog / PPAC (Petroleum Planning & Analysis Cell)**  
Ministry of Petroleum & Natural Gas  
Government of India

Dataset covers: **June 2017 - June 2025**

**Cities:** Delhi, Mumbai, Chennai, Kolkata  
**Fuel Types:** Petrol, Diesel

---

##  Screenshots

### Full Dashboard View
![Full Dashboard](./screenshots/dashboard_light_theme.png)

### Latest Price
![Dashboard Dark Mode](./screenshots/Latest_prices.png)

### Monthly Trends Chart
![Monthly Trends](./screenshots/Montly_price_chart.png)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## �‍💻 Author

**Ashutosh Bansal** (ashutosh-techbit)  
GitHub: [@Ashutosh-techbit](https://github.com/Ashutosh-techbit)

---

*Built with ❤️ using React and TypeScript*
