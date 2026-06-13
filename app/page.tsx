"use client";

import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import { FormEvent, useMemo, useState } from "react";
import { feature } from "topojson-client";
import countriesTopology from "world-atlas/countries-50m.json";

type Metric = {
  label: string;
  value: string;
  sub: string;
  cta: string;
  tone: string;
  code: string;
};

const navItems = [
  ["Dashboard", "dashboard"],
  ["Grant Management", "grants"],
  ["Analytics & Insights", "analytics"],
  ["MEL Dashboard", "mel"],
  ["Knowledge Hub", "knowledge"],
  ["Ask Hub", "copilot"],
  ["Capacity Strengthening", "capacity"],
  ["Community & Collaboration", "community"],
  ["Reports & Documents", "reports"],
  ["Administration", "admin"],
  ["System Settings", "settings"]
];

const metrics: Metric[] = [
  { label: "Participating Councils", value: "20", sub: "Countries", cta: "View councils", tone: "indigo", code: "SC" },
  { label: "Active Grants", value: "312", sub: "+18 added this month", cta: "Review grants", tone: "green", code: "GR" },
  { label: "Total Funding", value: "$48.7M", sub: "Committed funding", cta: "View finances", tone: "blue", code: "$" },
  { label: "Projects in Progress", value: "276", sub: "88% on track", cta: "Track projects", tone: "amber", code: "PR" },
  { label: "Research Outputs", value: "1,842", sub: "Publications and datasets", cta: "View outputs", tone: "violet", code: "RO" },
  { label: "Capacity Building", value: "1,205", sub: "Individuals trained", cta: "View training", tone: "teal", code: "CB" }
];

const portfolio = [
  ["Agriculture & Food Security", "28%", "$13.6M", "#3f4ec9"],
  ["Health & Wellbeing", "18%", "$8.8M", "#2b9e61"],
  ["Climate & Environment", "16%", "$7.8M", "#7ab857"],
  ["ICT & Digital Innovation", "12%", "$5.8M", "#2e7bcf"],
  ["Education & Skills", "9%", "$4.4M", "#1b9575"],
  ["Governance & Policy", "7%", "$3.2M", "#d88921"],
  ["Other Areas", "10%", "$4.9M", "#7b61c8"]
];

const countries = [
  ["Kenya", "$6.2M"],
  ["Nigeria", "$5.7M"],
  ["South Africa", "$5.1M"],
  ["Ethiopia", "$4.3M"],
  ["Tanzania", "$3.8M"],
  ["Ghana", "$2.9M"],
  ["Uganda", "$2.7M"],
  ["Zambia", "$2.4M"],
  ["Other countries", "$15.6M"]
];

const alerts = [
  ["Risk", "3 projects are delayed", "Require attention", "2h ago"],
  ["Funding", "New call for proposals", "Agriculture research funding window", "5h ago"],
  ["Report", "Quarterly MEL report", "Q2 2026 report is ready", "1d ago"],
  ["Meeting", "CSC Meeting Reminder", "15 May 2026", "1d ago"]
];

const insights = [
  ["Portfolio coverage note", "Plant health funding in Central Africa is below the regional benchmark.", "2h ago"],
  ["New activity pattern", "Agriculture projects using data-driven methods increased compared with last year.", "5h ago"],
  ["Potential joint call", "6 councils are funding related work on climate-smart agriculture.", "1d ago"]
];

const quickAccess = [
  "Grant Pipeline",
  "Reviewer Database",
  "Policies & Guidelines",
  "Best Practices",
  "Data Repository",
  "Training Calendar",
  "Knowledge Network"
];

const languageGroups = [
  {
    country: "Kenya",
    languages: ["Swahili", "Kikuyu", "Luo", "Kalenjin", "Luhya", "Kamba", "Kisii"]
  },
  {
    country: "Nigeria",
    languages: ["Hausa", "Yoruba", "Igbo", "Fulfulde", "Kanuri", "Tiv", "Other indigenous languages"]
  },
  {
    country: "South Africa",
    languages: ["Zulu", "Xhosa", "Afrikaans", "Sesotho", "Setswana", "Sepedi", "Tsonga", "Venda", "Ndebele", "Siswati", "South African Sign Language"]
  },
  {
    country: "Ethiopia",
    languages: ["Amharic", "Oromo", "Tigrinya", "Somali", "Afar", "Sidama", "Other Ethiopian languages"]
  },
  {
    country: "Tanzania",
    languages: ["Swahili", "Sukuma", "Chagga", "Haya", "Nyamwezi", "Other local languages"]
  },
  {
    country: "Ghana",
    languages: ["Akan (Twi/Fante)", "Ewe", "Ga", "Dagbani", "Nzema", "Other Ghanaian languages"]
  },
  {
    country: "Uganda",
    languages: ["Swahili", "Luganda", "Runyankole", "Ateso", "Luo", "Other indigenous languages"]
  },
  {
    country: "Zambia",
    languages: ["Bemba", "Nyanja", "Tonga", "Lozi", "Kaonde", "Lunda", "Luvale"]
  }
];

const copilotAnswers: Record<string, string> = {
  maize: "There are 8 active maize disease projects in Kenya, Zambia, Malawi, Tanzania, and Zimbabwe. Northern Zambia is flagged for follow-up based on recent field reports.",
  grants: "The grants with the best delivery record are multi-country projects with field validation and regular partner reporting. Plant health surveillance is currently at 92% milestone completion.",
  gender: "Current reports show 46% female farmer participation and 38% youth participation in the maize disease programme. Three projects still need updated gender-disaggregated data.",
  policy: "A draft brief can be prepared on maize disease risks in Southern Africa, covering surveillance, extension support, and shared datasets."
};

const africaCountryNames = new Set([
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cameroon",
  "Central African Rep.",
  "Chad",
  "Congo",
  "Côte d'Ivoire",
  "Dem. Rep. Congo",
  "Djibouti",
  "Egypt",
  "Eq. Guinea",
  "Eritrea",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Senegal",
  "Sierra Leone",
  "Somalia",
  "Somaliland",
  "South Africa",
  "S. Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "W. Sahara",
  "Zambia",
  "Zimbabwe",
  "eSwatini"
]);

const countryFunding: Record<string, "high" | "mid" | "low"> = {
  Kenya: "high",
  Nigeria: "high",
  "South Africa": "high",
  Ethiopia: "mid",
  Tanzania: "mid",
  Ghana: "mid",
  Uganda: "low",
  Zambia: "low"
};

const countryLabelOverrides: Record<string, [number, number]> = {
  Ghana: [-3, 2],
  Uganda: [4, -3],
  Zambia: [0, 5],
  "South Africa": [0, 7]
};

const rawCountries = feature(
  countriesTopology as never,
  (countriesTopology as unknown as { objects: { countries: never } }).objects.countries
) as unknown as {
  features: Array<{
    id?: string;
    properties: { name: string };
    geometry: GeoJSON.Geometry;
    type: "Feature";
  }>;
};

const africaFeatures = rawCountries.features.filter((item) => africaCountryNames.has(item.properties.name));

function AfricaFundingMap() {
  const width = 310;
  const height = 270;
  const projection = geoMercator().fitExtent(
    [
      [10, 8],
      [300, 262]
    ],
    { type: "FeatureCollection", features: africaFeatures } as GeoJSON.FeatureCollection
  );
  const path = geoPath(projection);
  const labelNames = Object.keys(countryFunding);

  return (
    <svg className="real-africa-map" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Africa map with funded countries highlighted">
      <g>
        {africaFeatures.map((country) => {
          const name = country.properties.name;
          const tone = countryFunding[name] ?? "base";
          return (
            <path
              className={`africa-country ${tone}`}
              d={path(country as GeoJSON.Feature) ?? ""}
              key={name}
            >
              <title>{name}</title>
            </path>
          );
        })}
      </g>
      <g>
        {africaFeatures
          .filter((country) => labelNames.includes(country.properties.name))
          .map((country) => {
            const [lon, lat] = geoCentroid(country as GeoJSON.Feature);
            const projected = projection([lon, lat]);
            if (!projected) return null;
            const [dx, dy] = countryLabelOverrides[country.properties.name] ?? [0, 0];
            const x = (projected[0] + dx).toFixed(2);
            const y = (projected[1] + dy).toFixed(2);
            return (
              <text className="map-label" key={country.properties.name} x={x} y={y}>
                {country.properties.name}
              </text>
            );
          })}
      </g>
    </svg>
  );
}

function CodeIcon({ children, tone }: { children: string; tone?: string }) {
  return <span className={`code-icon ${tone ?? ""}`} aria-hidden="true">{children}</span>;
}

function NavIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {name === "dashboard" && (
        <>
          <rect {...common} x="3" y="3" width="7" height="7" rx="1.5" />
          <rect {...common} x="14" y="3" width="7" height="7" rx="1.5" />
          <rect {...common} x="3" y="14" width="7" height="7" rx="1.5" />
          <rect {...common} x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      )}
      {name === "grants" && (
        <>
          <path {...common} d="M5 10h14" />
          <path {...common} d="M6 10v9h12v-9" />
          <path {...common} d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path {...common} d="M10 15h4" />
        </>
      )}
      {name === "analytics" && (
        <>
          <path {...common} d="M4 19V5" />
          <path {...common} d="M4 19h16" />
          <path {...common} d="M8 16v-4" />
          <path {...common} d="M12 16V8" />
          <path {...common} d="M16 16v-7" />
        </>
      )}
      {name === "mel" && (
        <>
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="M12 12 16 8" />
          <path {...common} d="M8 16h8" />
        </>
      )}
      {name === "knowledge" && (
        <>
          <path {...common} d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22z" />
          <path {...common} d="M5 5.5V22" />
          <path {...common} d="M9 7h7" />
        </>
      )}
      {name === "copilot" && (
        <>
          <rect {...common} x="5" y="7" width="14" height="11" rx="3" />
          <path {...common} d="M9 7V5" />
          <path {...common} d="M15 7V5" />
          <path {...common} d="M9 12h.01" />
          <path {...common} d="M15 12h.01" />
          <path {...common} d="M10 16h4" />
        </>
      )}
      {name === "capacity" && (
        <>
          <circle {...common} cx="12" cy="7" r="3" />
          <path {...common} d="M5 21a7 7 0 0 1 14 0" />
          <path {...common} d="M18 8h3" />
          <path {...common} d="M19.5 6.5v3" />
        </>
      )}
      {name === "community" && (
        <>
          <circle {...common} cx="8" cy="8" r="3" />
          <circle {...common} cx="17" cy="9" r="2.5" />
          <path {...common} d="M3 20a5 5 0 0 1 10 0" />
          <path {...common} d="M14 20a4 4 0 0 1 7 0" />
        </>
      )}
      {name === "reports" && (
        <>
          <path {...common} d="M7 3h7l4 4v14H7z" />
          <path {...common} d="M14 3v5h5" />
          <path {...common} d="M9 13h6" />
          <path {...common} d="M9 17h6" />
        </>
      )}
      {name === "admin" && (
        <>
          <path {...common} d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
          <path {...common} d="M9 12l2 2 4-4" />
        </>
      )}
      {name === "settings" && (
        <>
          <circle {...common} cx="12" cy="12" r="3" />
          <path {...common} d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.1L14 3h-4l-.5 2.8a7 7 0 0 0-2 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.1L10 21h4l.5-2.8a7 7 0 0 0 2-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
        </>
      )}
    </svg>
  );
}

export default function Dashboard() {
  const [section, setSection] = useState("Dashboard");
  const [country, setCountry] = useState("All Countries");
  const [council, setCouncil] = useState("All Councils");
  const [toast, setToast] = useState("Dashboard overview loaded");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("How can I help? I can look up grants, reports, policy documents, and MEL indicators.");
  const [chatOpen, setChatOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const sectionHint = useMemo(() => {
    if (section === "Dashboard") return "Portfolio status, funding, project delivery, and research outputs.";
    if (section === "Ask Hub") return "Search grants, reports, policy documents, and MEL indicators.";
    return `${section} view filtered by ${country} and ${council}.`;
  }, [country, council, section]);

  function openPanel(label: string) {
    setToast(`${label} opened`);
    if (label.includes("MEL")) setSection("MEL Dashboard");
    if (label.includes("AI") || label.includes("Ask Hub") || label.includes("Assistant")) {
      setSection("Ask Hub");
      setChatOpen(true);
    }
  }

  function askCopilot(prompt: string) {
    const key = prompt.toLowerCase().includes("maize")
      ? "maize"
      : prompt.toLowerCase().includes("performing") || prompt.toLowerCase().includes("on track")
        ? "grants"
        : prompt.toLowerCase().includes("gender") || prompt.toLowerCase().includes("participation")
          ? "gender"
          : "policy";
    setAnswer(copilotAnswers[key]);
    setQuery(prompt);
    setSection("Ask Hub");
    setChatOpen(true);
    setToast("Response ready");
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    askCopilot(query);
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand-lockup" aria-label="AI-Evidence Hub">
          <div className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div>
            <strong>AI-EVIDENCE HUB</strong>
            <span>Evidence support for SGCs</span>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map(([label, icon]) => (
            <button
              className={section === label ? "active" : ""}
              key={label}
              onClick={() => {
                setSection(label);
                setToast(`${label} selected`);
                if (label === "Ask Hub") setChatOpen(true);
              }}
            >
              <NavIcon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="filters">
          <span>Filters</span>
          <select value={country} onChange={(event) => { setCountry(event.target.value); setToast(`Filtered by ${event.target.value}`); }}>
            <option>All Countries</option>
            <option>Kenya</option>
            <option>Zambia</option>
            <option>Nigeria</option>
            <option>South Africa</option>
          </select>
          <select value={council} onChange={(event) => { setCouncil(event.target.value); setToast(`Filtered by ${event.target.value}`); }}>
            <option>All Councils</option>
            <option>NRF South Africa</option>
            <option>NACOSTI Kenya</option>
            <option>NSTC Zambia</option>
          </select>
          <button className="date">01 Jan 2025 - 30 Apr 2026</button>
        </div>

        <div className="user-card">
          <div className="avatar">AO</div>
          <div>
            <strong>Admin Officer</strong>
            <span>SGCI Hub Admin</span>
          </div>
          <button onClick={() => setToast("Signed out state preview")}>Log out</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="menu" onClick={() => setToast("Sidebar menu toggled")} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
          <div className="title-block">
            <h1>AI-Evidence Hub Dashboard</h1>
            <p>{sectionHint}</p>
          </div>
          <div className="top-actions">
            <label className="language-control">
              <span>Language</span>
              <select
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  setToast(`Language set to ${event.target.value.replace(": ", " - ")}`);
                }}
              >
                <option value="English">English</option>
                {languageGroups.map((group) => (
                  <optgroup label={group.country} key={group.country}>
                    {group.languages.map((item) => (
                      <option key={`${group.country}-${item}`} value={`${group.country}: ${item}`}>
                        {group.country} - {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <button className="notification-button" onClick={() => setToast("8 notifications")} aria-label="8 notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.5 6.5A3.5 3.5 0 0 1 8 3h8a3.5 3.5 0 0 1 3.5 3.5v5A3.5 3.5 0 0 1 16 15h-4.8L6 19v-4.2a3.5 3.5 0 0 1-1.5-2.9z" />
                <path d="M8 8h8" />
                <path d="M8 11h5" />
              </svg>
              <span>8</span>
            </button>
            <img src="/assets/sgci-logo.png" alt="SGCI" />
          </div>
        </header>

        <div className="toast" role="status">{toast}</div>

        <section className="metric-grid" aria-label="Dashboard summary">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <CodeIcon tone={metric.tone}>{metric.code}</CodeIcon>
              <div className="metric-copy">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.sub}</small>
                <button onClick={() => openPanel(metric.label)}>{metric.cta}</button>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel portfolio-panel">
            <div className="card-header">
              <h2>Grant Portfolio by Thematic Area</h2>
              <button onClick={() => openPanel("Full portfolio")}>View portfolio</button>
            </div>
            <div className="portfolio-wrap">
              <div className="donut portfolio-donut"><strong>$48.7M</strong><span>Total funding</span></div>
              <ul className="legend">
                {portfolio.map(([name, pct, amount, color]) => (
                  <li key={name}>
                    <i style={{ backgroundColor: color }} />
                    <span>{name}</span>
                    <b>{pct}</b>
                    <em>{amount}</em>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel map-panel">
            <div className="card-header">
              <h2>Funding by Country</h2>
              <span>Committed</span>
            </div>
            <div className="map-wrap">
              <AfricaFundingMap />
              <ol className="country-list">
                {countries.map(([name, amount]) => <li key={name}><span>{name}</span><b>{amount}</b></li>)}
              </ol>
            </div>
            <div className="heat"><span>Low</span><i /><span>High</span></div>
          </article>

          <article className="panel progress-panel">
            <div className="card-header">
              <h2>Real-time Project Progress</h2>
              <button onClick={() => openPanel("MEL Dashboard")}>Open MEL</button>
            </div>
            <div className="progress-top">
              <div className="donut progress-donut"><strong>88%</strong><span>On track</span></div>
              <ul className="status-list">
                <li><i className="green-dot" /> <span>On Track</span> <b>243 (88%)</b></li>
                <li><i className="amber-dot" /> <span>At Risk</span> <b>22 (8%)</b></li>
                <li><i className="red-dot" /> <span>Delayed</span> <b>11 (4%)</b></li>
              </ul>
            </div>
            <div className="bars">
              {[
                ["Milestones Achieved", "88%", "1,124 / 1,278"],
                ["Budget Utilization", "72%", "72%"],
                ["Gender Inclusion", "46%", "46%"],
                ["Open Science Compliance", "68%", "68%"]
              ].map(([label, width, val]) => (
                <label key={label}>
                  <span className="bar-label">{label}</span>
                  <span className="bar-track"><i style={{ width }} /></span>
                  <b>{val}</b>
                </label>
              ))}
            </div>
          </article>

          <aside className="side-stack">
            <article className="panel alerts">
              <div className="card-header">
                <h2>Alerts & Notifications</h2>
                <button onClick={() => openPanel("All alerts")}>View all</button>
              </div>
              {alerts.map(([kind, title, sub, time]) => (
                <button className="list-item" key={title} onClick={() => setToast(title)}>
                  <i>{kind}</i>
                  <span><b>{title}</b><small>{sub}</small></span>
                  <em>{time}</em>
                </button>
              ))}
            </article>
          </aside>

          <article className="panel outputs">
            <div className="card-header">
              <h2>Research Outputs Overview</h2>
              <select onChange={() => setToast("Research output date range changed")}><option>This Year</option><option>Last Year</option></select>
            </div>
            <div className="output-stats">
              <b>785<span>Publications</span></b>
              <b>312<span>Datasets</span></b>
              <b>96<span>Patents</span></b>
              <b>649<span>Policy Briefs</span></b>
            </div>
            <svg className="line-chart" viewBox="0 0 620 235" aria-label="Research output line chart">
              {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="30" x2="600" y1={y} y2={y} />)}
              <polyline className="series purple" points="30,160 85,154 140,98 195,99 250,112 305,96 360,124 415,88 470,103 525,82 580,111" />
              <polyline className="series blue" points="30,178 85,177 140,142 195,141 250,151 305,146 360,149 415,124 470,135 525,122 580,140" />
              <polyline className="series green" points="30,205 85,202 140,180 195,194 250,198 305,197 360,203 415,188 470,198 525,184 580,195" />
              <polyline className="series amber" points="30,222 85,220 140,218 195,214 250,219 305,221 360,218 415,212 470,221 525,216 580,220" />
            </svg>
            <div className="chart-legend"><span>Publications</span><span>Datasets</span><span>Patents</span><span>Policy Briefs</span></div>
          </article>

          <article className="panel insights">
            <div className="card-header">
              <h2>Portfolio Notes</h2>
              <button onClick={() => openPanel("Portfolio notes")}>View all</button>
            </div>
            {insights.map(([title, text, time]) => (
              <button className="insight-row" key={title} onClick={() => setToast(title)}>
                <span><b>{title}</b>{text}</span>
                <em>{time}</em>
              </button>
            ))}
          </article>

          <article className="panel capacity">
            <div className="card-header">
              <h2>Capacity Strengthening Progress</h2>
              <select onChange={() => setToast("Capacity range changed")}><option>This Year</option></select>
            </div>
            <div className="capacity-body">
              <div className="capacity-stats">
                <b>1,205<span>Individuals Trained</span></b>
                <b>124<span>Training Activities</span></b>
                <b>86<span>Institutions Supported</span></b>
                <b>20<span>Countries Reached</span></b>
              </div>
              <div className="donut capacity-donut"><strong>72%</strong><span>Maturity score</span></div>
            </div>
            <div className="maturity"><span>Advanced (20%)</span><span>Intermediate (52%)</span><span>Developing (22%)</span><span>Nascent (6%)</span></div>
          </article>

          <article className="panel quick">
            <div className="card-header"><h2>Quick Access</h2></div>
            <div>
              {quickAccess.map((item) => <button key={item} onClick={() => openPanel(item)}>{item}</button>)}
            </div>
          </article>

          <article className="panel documents">
            <div className="card-header">
              <h2>Recent Documents</h2>
              <button onClick={() => openPanel("Documents")}>View all</button>
            </div>
            {["SGCI MEL Framework 2026.pdf", "Research Governance Brief.pdf", "Q2 2026 Performance Report.pdf"].map((doc, index) => <button key={doc} onClick={() => setToast(`${doc} preview opened`)}><span>{doc}</span><em>{index + 1}d ago</em></button>)}
          </article>

          <article className="panel events">
            <div className="card-header">
              <h2>Upcoming Events</h2>
              <button onClick={() => openPanel("Events")}>View all</button>
            </div>
            {[
              ["CSC Meeting", "15 May 2026"],
              ["MEL Training - Francophone", "20 May 2026"],
              ["Open Science Webinar", "28 May 2026"]
            ].map(([event, date]) => <button key={event} onClick={() => setToast(`${event} added to calendar`)}><span>{event}</span><em>{date}</em></button>)}
          </article>
        </section>

        <button className="chat-launcher" onClick={() => setChatOpen((current) => !current)} aria-expanded={chatOpen} aria-controls="dashboard-chatbot">
          <span>Chat</span>
          <b>{chatOpen ? "Close" : "Open"}</b>
        </button>

        {chatOpen && (
          <section className="chat-window" id="dashboard-chatbot" aria-label="AI-Evidence Hub knowledge assistant">
            <header>
              <div>
                <strong>Ask Hub</strong>
                <span>Grants, MEL, policy documents, and research outputs</span>
              </div>
              <button onClick={() => setChatOpen(false)} aria-label="Close chatbot">Close</button>
            </header>
            <div className="chat-body">
              <p className="chat-message assistant">{answer}</p>
              <div className="chat-prompts">
                {[
                  "Show maize disease projects",
                  "Which grants are on track?",
                  "Summarise gender participation",
                  "Prepare a maize disease policy brief"
                ].map((prompt) => <button key={prompt} onClick={() => askCopilot(prompt)}>{prompt}</button>)}
              </div>
            </div>
            <form className="chat-form" onSubmit={submitQuestion}>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about a grant, report, or indicator" />
              <button aria-label="Send chatbot question">Send</button>
            </form>
            <small>Check source documents before using this in official reporting.</small>
          </section>
        )}
      </section>
    </main>
  );
}
