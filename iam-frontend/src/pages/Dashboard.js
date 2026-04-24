import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getThreats } from "../api";

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getThreats().then(data => {
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setThreats(sorted);
    });
  }, []);

  // =========================
  // NAVIGATION
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  // =========================
  // GROUP DATA
  // =========================
  const grouped = threats.reduce((acc, t) => {
    if (!acc[t.type]) {
      acc[t.type] = {
        count: 0,
        latest: t.createdAt,
        severity: t.severity,
        detail: t.detail,
      };
    }

    acc[t.type].count++;

    if (new Date(t.createdAt) > new Date(acc[t.type].latest)) {
      acc[t.type].latest = t.createdAt;
      acc[t.type].detail = t.detail;
    }

    return acc;
  }, {});

  const total = threats.length;
  const high = threats.filter(t => t.severity === "high").length;
  const medium = threats.filter(t => t.severity === "medium").length;

  const sortedGrouped = Object.entries(grouped).sort((a, b) => {
    if (a[1].severity === "high") return -1;
    if (b[1].severity === "high") return 1;
    return 0;
  });

  return (
    <div>

      {/* =========================
          ACTION BUTTONS
      ========================= */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

        <button
          onClick={goToAdmin}
          style={{
            padding: "20px 30px",
            fontSize: "1.2rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Admin Panel
        </button>

      </div>

      {/* =========================
          TITLE
      ========================= */}
      <div className="section-title">Threat Overview</div>

      <div className="guide">
        This dashboard highlights suspicious login behavior and security threats.
      </div>

      {/* =========================
          STATS
      ========================= */}
      <div className="stats">
        <div className="stat-card total">
          Total
          <b>{total}</b>
        </div>

        <div className="stat-card high">
          High Risk
          <b>{high}</b>
        </div>

        <div className="stat-card medium">
          Medium Risk
          <b>{medium}</b>
        </div>
      </div>

      {/* =========================
          GRID
      ========================= */}
      <div className="dashboard-grid">

        {/* LEFT */}
        <div>
          <div className="section-title">Detected Patterns</div>

          {sortedGrouped.map(([type, data]) => (
            <div key={type} className="threat-card">
              <div className="threat-title">
                {type}
                <span className={`tag ${data.severity}`}>
                  {data.severity}
                </span>
              </div>

              <div className="threat-detail">
                Occurrences: {data.count}
              </div>

              <div className="threat-detail">
                Last: {new Date(data.latest).toLocaleString()}
              </div>

              <div className="threat-detail">{data.detail}</div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          <div className="section-title">Recent Activity</div>

          <div className="activity-box">
            {threats.slice(0, 12).map(t => (
              <div key={t._id} className="threat-card">
                <div className="threat-title">
                  {t.type}
                  <span className={`tag ${t.severity}`}>
                    {t.severity}
                  </span>
                </div>

                <div className="threat-detail">{t.detail}</div>

                <div className="threat-time">
                  {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}