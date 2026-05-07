import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const Reports = () => {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([
    { day: 1, sales: 2000, payments: 1500, due: 500 },
    { day: 5, sales: 4500, payments: 4000, due: 500 },
    { day: 10, sales: 3000, payments: 3000, due: 0 },
    { day: 15, sales: 6000, payments: 4500, due: 1500 },
    { day: 20, sales: 4000, payments: 4000, due: 0 },
    { day: 25, sales: 7000, payments: 6000, due: 1000 },
  ]);
const [searchTerm, setSearchTerm] = useState("");
const [filteredInvoices, setFilteredInvoices] = useState([]);

const [summary, setSummary] = useState({
  totalSales: 150000,
  totalPurchase: 80000,
  pAndL: 70000,
  totalAmount: 150000,
});
const [invoices, setInvoices] = useState([
  { 
    _id: "1", 
    invoiceNo: "INV-001", 
    customer: { name: "John Doe", address: "Kolkata, WB", contact: "9876543210" }, 
    date: "2026-05-01", 
    grandTotal: 5000,
    paid: 4500,
    balance: 500,
    items: [
      { productName: "Vanilla Ice Cream", qty: 10, rate: 450, discount: 5, total: 4275 },
      { productName: "Chocolate Bars", qty: 5, rate: 120, discount: 0, total: 600 }
    ]
  },
  { 
    _id: "2", 
    invoiceNo: "INV-002", 
    customer: { name: "Jane Smith", address: "Mumbai, MH", contact: "8765432109" }, 
    date: "2026-05-02", 
    grandTotal: 10000,
    paid: 10000,
    balance: 0,
    items: [
      { productName: "Strawberry Syrup", qty: 20, rate: 300, discount: 10, total: 5400 },
      { productName: "Vanilla Ice Cream", qty: 10, rate: 450, discount: 0, total: 4500 }
    ]
  },
]);

useEffect(() => {
  setFilteredInvoices(invoices);
}, [invoices]);

const handleSearch = (value) => {
  setSearchTerm(value);
  if (!value.trim()) {
    setFilteredInvoices(invoices);
    return;
  }
  const filtered = invoices.filter(inv =>
    inv.invoiceNo?.toLowerCase().includes(value.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredInvoices(filtered);
};

const [selectedDate, setSelectedDate] = useState(new Date());
const selectedYear = selectedDate.getFullYear();
const selectedMonth = selectedDate.getMonth() + 1;
const selectedDay = selectedDate.getDate();

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const months = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];

const fetchReports = async (date = selectedDate) => {
  // Demo data already set
};

const fetchMonthlyChart = async (year, month) => {
  // Demo data already set
};

useEffect(() => {
  // No longer fetching from backend
}, [selectedDate]);
const handleView = (inv) => {
  navigate("/Invoice/Preview", {
    state: {
      invoiceData: inv
    }
  });
};


  const handlePrint = (inv) => {
  navigate("/Invoice/Preview", {
    state: {
      invoiceData: inv,
      autoPrint: true
    }
  });
};

const exportToCSV = () => {
  if (!invoices.length) {
    alert("No invoices found");
    return;
  }

  // Helper function to escape CSV fields
  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    // Always wrap in quotes and escape internal quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headers = [
    "Date",
    "Customer Name",
    "Invoice No",
    "Total Amount",
    "Paid Amount",
    "Due Amount"
  ];

  const rows = invoices.map(inv => [
    new Date(inv.date).toLocaleDateString(),
    inv.customer?.name || "N/A",
    inv.invoiceNo || "",
    inv.grandTotal ?? 0,
    inv.paid ?? 0,
    inv.balance ?? 0
  ]);

  // Create CSV content with proper escaping
  const csvRows = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, `Invoice_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  




  return (
    <div style={styles.container}>
      {/* Header with Search and Actions */}
      <div style={styles.headerRow}>
        <div style={styles.titleSection}>
          <h2 style={styles.heading}>Reports</h2>
          <p style={styles.subheading}>Summaries and business analytics</p>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Search Invoice by Invoice NO or Name" 
              style={styles.searchInput} 
              value={searchTerm}
               onChange={(e) => handleSearch(e.target.value)}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <div style={styles.dateSelector}>

<select
  value={selectedMonth}
  onChange={(e) => {
    const newDate = new Date(selectedYear, e.target.value - 1, 1);
    setSelectedDate(newDate);
    fetchReports(newDate);
    fetchMonthlyChart(newDate.getFullYear(), newDate.getMonth() + 1);
  }}
  style={styles.select}
>
  {months.map(m => (
    <option key={m.value} value={m.value}>
      {m.label}
    </option>
  ))}
</select>


<select
  value={selectedYear}
  onChange={(e) => {
    const newDate = new Date(e.target.value, selectedMonth - 1, 1);
    setSelectedDate(newDate);
    fetchReports(newDate);
    fetchMonthlyChart(newDate.getFullYear(), newDate.getMonth() + 1);
  }}
  style={styles.select}
>
  {years.map(y => (
    <option key={y} value={y}>
      {y}
    </option>
  ))}
</select>

</div>

          
          <button style={styles.exportBtn} onClick={exportToCSV}>
            <span style={styles.downloadIcon}>📥</span> Export as CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <SummaryCard title="TOTAL SALE" value={summary.totalSales} icon="💰" color="#60a3a9" />
        <SummaryCard title="TOTAL PURCHASE AMOUNT" value={summary.totalPurchase} icon="💰" color="#60a3a9" />
        <SummaryCard title="P & L" value={summary.pAndL} color="#86a2b8" />
        <SummaryCard title="TOTAL AMOUNT" value={summary.totalAmount} color="#60a3a9" />
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        <ChartBox title="Monthly Sales VS Payments" type="line" data ={chartData} />
        <ChartBox title="Outstanding Due by the Customer" type="bar-horizontal" data={chartData} />
        <ChartBox title="Monthly Revenue Trend" type="bar-vertical"  data={chartData}/>
      </div>

      {/* Invoice Summary Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Invoice Summary</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Invoice No.</th>
              <th style={styles.th}>Paid Amount (₹)</th>
              <th style={styles.th}>Due Amount (₹)</th>
              <th style={styles.th}>Reference ID</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(searchTerm ? filteredInvoices : invoices).map((inv, index)  => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{new Date(inv.date).toLocaleDateString()}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>
              {inv.customer
              ? inv.customer.isActive === false
              ? <span style={{ color: "red" }}>
             {inv.customer.name} (Inactive)
            </span>
              : inv.customer.name
              : "N/A"}
            </td>
                <td style={styles.td}>{inv.invoiceNo}</td>
                <td style={styles.td}>₹ {(inv.paid || 0).toLocaleString()}</td>
                <td style={styles.td}>₹ {(inv.balance || 0).toLocaleString()}</td>
                <td style={styles.td}> {inv.reference}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => handleView(inv)}>👁️</button>
                  <button style={styles.actionBtn} onClick ={() => handlePrint(inv)}>📥</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

/* ---- Sub-components ---- */

const SummaryCard = ({ title, value, icon, color }) => (
  <div style={{ ...styles.card, backgroundColor: color }}>
    <div style={styles.cardHeader}>
      {icon && <span style={styles.cardIcon}>{icon}</span>}
      <p style={styles.cardTitle}>{title}</p>
    </div>
    <h3 style={styles.cardValue}>{typeof value === 'number' ? `₹ ${value.toLocaleString()}` : value}</h3>
  </div>
);

const ChartBox = ({ title, type, data }) => (
  <div style={styles.chartBox}>
    <p style={styles.chartTitle}>{title}</p>
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height={250}>
        {type === "line" && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" interval={4} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4a6b82" strokeWidth={3} name="Total Sales" dot={false}/>
            <Line type="monotone" dataKey="payments" stroke="#40b5ad" strokeWidth={3} name="Payments Received" dot={false}/>
          </LineChart>
        )}

        {type === "bar-horizontal" && (
          <BarChart layout="vertical" data={data.filter(d => d.due > 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="day" type="category" width={40} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="due" fill="#ff7675" name="Outstanding Due" />
          </BarChart>
        )}

        {type === "bar-vertical" && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" interval={4} tick={{ fontSize: 11 }}/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#60a3a9" name="Revenue" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);


/* ---- Styles ---- */

const styles = {
  container: { padding: "20px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh' },
  // headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
  headerRow: { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: '25px' 
},
  titleSection: { flex: 1 },
  heading: { margin: 0, fontSize: "32px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#64748b" },
  select: {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginRight: "10px"
},

  
  // headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  headerActions: { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '20px',
  flexWrap: "wrap"
},
  searchWrapper: { position: 'relative' },
  // searchInput: { padding: '10px 40px 10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '300px', outline: 'none' },
  searchInput: { 
  padding: '10px 40px 10px 15px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  width: '100%',
  maxWidth: '300px',
  outline: 'none'
},
  searchIcon: { position: 'absolute', right: '12px', top: '10px', color: '#64748b' },
  dateSelector: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
  
  exportBtn: { background: '#4a6b82', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
  
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  card: { padding: "20px", borderRadius: "15px", color: "white", boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  cardIcon: { background: 'rgba(255,255,255,0.2)', padding: '5px', borderRadius: '5px' },
  cardTitle: { margin: 0, fontSize: "14px", fontWeight: "600", opacity: 0.9 },
  cardValue: { margin: 0, fontSize: "28px", fontWeight: "bold" },

  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" },
  chartBox: { backgroundColor: "#d1dee2", padding: "15px", borderRadius: "15px", border: '1px solid #94a3b8', minWidth: 0 },
  chartTitle: { fontSize: "14px", fontWeight: "bold", textAlign: 'center', marginBottom: '15px' },
  chartPlaceholder: { height: "200px", background: 'rgba(255,255,255,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  tableCard: { backgroundColor: "#d1dee2", padding: "20px", borderRadius: "15px", border: '1px solid #94a3b8',  overflowX: "auto" },
  tableTitle: { margin: '0 0 15px 0', fontSize: '24px', fontWeight: 'bold' },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { borderBottom: '2px solid #333' },
  th: { padding: "12px", textAlign: "left", fontSize: "14px", color: '#333' },
  tr: { borderBottom: '1px solid #94a3b8' },
  td: { padding: "15px 12px", fontSize: "14px" },
  actionBtn: { background: '#40b5ad', border: 'none', borderRadius: '5px', padding: '5px 8px', marginRight: '5px', cursor: 'pointer' },
};

export default Reports;