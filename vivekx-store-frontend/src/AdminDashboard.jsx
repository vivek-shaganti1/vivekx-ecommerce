import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, AreaChart, Area
} from "recharts";
import { Link } from "react-router-dom";
import AdminProductTable from "./AdminProductTable";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState(null);
  const [isDark, setIsDark] = useState(document.body.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const themeColors = {
    grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    axis: isDark ? "#888" : "#444",
    primary: isDark ? "#e50914" : "#caa133",
    tooltipBg: isDark ? "#12121c" : "#ffffff",
  };

  async function fetchSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/admin/summary`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="admin-loading"><h2>Initializing Dashboard...</h2></div>;

  const orderDist = [
    { name: "Placed", value: stats.placed },
    { name: "Transit", value: stats.shipped },
    { name: "Done", value: stats.delivered },
    { name: "Fail", value: stats.cancelled }
  ];

  return (
    <div className="admin-container animate-in">
      <header className="admin-hero">
        <div className="admin-title-wrap">
          <span className="admin-status-pill"><span className="pulse-dot"></span> Management Active</span>
          <h1>Admin <span className="gold-text">Dashboard</span></h1>
        </div>
        <Link to="/admin/add-product" className="add-product-btn">
          Add Product
        </Link>
      </header>

      <div className="admin-stats-grid">
        <StatCard title="REVENUE" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" isMain />
        <StatCard title="ORDERS" value={stats.totalOrders} icon="📦" />
        <StatCard title="TRANSIT" value={stats.shipped} icon="🚚" />
        <StatCard title="DELIVERED" value={stats.delivered} icon="✅" />
      </div>

      <div className="admin-dashboard-grid">
        <div className="chart-card glass animate-in" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
          <h3>Revenue Insight (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.history}>
                <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                <XAxis dataKey="date" stroke={themeColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={themeColors.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} />
                <Area type="monotone" dataKey="revenue" stroke={themeColors.primary} strokeWidth={3} fill={themeColors.primary} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass animate-in" style={{ minHeight: '400px' }}>
          <h3>Volume Split</h3>
          <div style={{ width: '100%', height: 300, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderDist}>
                <XAxis dataKey="name" stroke={themeColors.axis} fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: themeColors.tooltipBg, borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {orderDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#4CAF50' : themeColors.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <AdminProductTable />
    </div>
  );
}

function StatCard({ title, value, icon, isMain }) {
  return (
    <div className={`admin-stat-card glass ${isMain ? 'featured-card' : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div className="stat-info">
        <h4>{title}</h4>
        <h2 className={isMain ? 'gold-text' : ''}>{value}</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;