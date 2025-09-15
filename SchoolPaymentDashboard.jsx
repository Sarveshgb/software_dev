import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  School,
  CreditCard,
  Eye,
  Loader,
  XCircle,
} from "lucide-react";
import "./SchoolPaymentDashboard.css";

// Mock API functions (replace with actual axios calls to your backend)
const mockApi = {
  fetchTransactions: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockTransactions = [
      {
        collect_id: "txn_001",
        school_id: "65b0e6293e9f76a9694d84b4",
        gateway: "PhonePe",
        order_amount: 2000,
        transaction_amount: 2200,
        status: "success",
        custom_order_id: "ORD_001",
        payment_time: "2025-01-15T10:30:00Z",
        payment_mode: "UPI",
        student_name: "John Doe",
      },
      {
        collect_id: "txn_002",
        school_id: "65b0e6293e9f76a9694d84b5",
        gateway: "Razorpay",
        order_amount: 1500,
        transaction_amount: 1650,
        status: "pending",
        custom_order_id: "ORD_002",
        payment_time: "2025-01-14T09:15:00Z",
        payment_mode: "Card",
        student_name: "Jane Smith",
      },
      {
        collect_id: "txn_003",
        school_id: "65b0e6293e9f76a9694d84b4",
        gateway: "PayU",
        order_amount: 3000,
        transaction_amount: 3300,
        status: "failed",
        custom_order_id: "ORD_003",
        payment_time: "2025-01-13T14:45:00Z",
        payment_mode: "Net Banking",
        student_name: "Mike Johnson",
      },
      {
        collect_id: "txn_004",
        school_id: "65b0e6293e9f76a9694d84b6",
        gateway: "Stripe",
        order_amount: 2500,
        transaction_amount: 2550,
        status: "success",
        custom_order_id: "ORD_004",
        payment_time: "2025-01-12T16:20:00Z",
        payment_mode: "Card",
        student_name: "Emily Davis",
      },
      {
        collect_id: "txn_005",
        school_id: "65b0e6293e9f76a9694d84b7",
        gateway: "Cashfree",
        order_amount: 1800,
        transaction_amount: 1850,
        status: "success",
        custom_order_id: "ORD_005",
        payment_time: "2025-01-11T11:05:00Z",
        payment_mode: "Wallet",
        student_name: "Chris Lee",
      },
      {
        collect_id: "txn_006",
        school_id: "65b0e6293e9f76a9694d84b5",
        gateway: "Razorpay",
        order_amount: 2200,
        transaction_amount: 2400,
        status: "pending",
        custom_order_id: "ORD_006",
        payment_time: "2025-01-10T13:40:00Z",
        payment_mode: "UPI",
        student_name: "Sophia Martinez",
      },
      {
        collect_id: "txn_007",
        school_id: "65b0e6293e9f76a9694d84b8",
        gateway: "PhonePe",
        order_amount: 1000,
        transaction_amount: 1050,
        status: "failed",
        custom_order_id: "ORD_007",
        payment_time: "2025-01-09T08:25:00Z",
        payment_mode: "Card",
        student_name: "Liam Brown",
      },
      {
        collect_id: "txn_008",
        school_id: "65b0e6293e9f76a9694d84b9",
        gateway: "Paytm",
        order_amount: 2700,
        transaction_amount: 2800,
        status: "success",
        custom_order_id: "ORD_008",
        payment_time: "2025-01-08T18:10:00Z",
        payment_mode: "Wallet",
        student_name: "Olivia Wilson",
      },
      {
        collect_id: "txn_009",
        school_id: "65b0e6293e9f76a9694d84b4",
        gateway: "Stripe",
        order_amount: 3200,
        transaction_amount: 3350,
        status: "pending",
        custom_order_id: "ORD_009",
        payment_time: "2025-01-07T15:50:00Z",
        payment_mode: "Net Banking",
        student_name: "Noah Anderson",
      },
      {
        collect_id: "txn_010",
        school_id: "65b0e6293e9f76a9694d84b6",
        gateway: "PayU",
        order_amount: 1400,
        transaction_amount: 1500,
        status: "success",
        custom_order_id: "ORD_010",
        payment_time: "2025-01-06T12:35:00Z",
        payment_mode: "UPI",
        student_name: "Ava Taylor",
      },
    ];

    let filteredTransactions = mockTransactions;

    if (params.status) {
      filteredTransactions = filteredTransactions.filter(
        (txn) => txn.status === params.status
      );
    }

    if (params.school_id) {
      filteredTransactions = filteredTransactions.filter((txn) =>
        txn.school_id.includes(params.school_id)
      );
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (txn) =>
          txn.custom_order_id.toLowerCase().includes(searchLower) ||
          txn.student_name.toLowerCase().includes(searchLower)
      );
    }

    if (params.date_from) {
      const fromDate = new Date(params.date_from);
      filteredTransactions = filteredTransactions.filter(
        (txn) => new Date(txn.payment_time) >= fromDate
      );
    }
    if (params.date_to) {
      const toDate = new Date(params.date_to);
      toDate.setHours(23, 59, 59, 999);
      filteredTransactions = filteredTransactions.filter(
        (txn) => new Date(txn.payment_time) <= toDate
      );
    }

    if (params.sort) {
      filteredTransactions.sort((a, b) => {
        const valueA = a[params.sort];
        const valueB = b[params.sort];
        if (params.order === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    return {
      data: filteredTransactions,
      total: filteredTransactions.length,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },
};

const SchoolPaymentDashboard = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    school_id: "",
    date_from: "",
    date_to: "",
    search: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    if (currentView === "overview") {
      loadTransactions();
    }
  }, [currentView, pagination.page, sortConfig]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortConfig.key,
        order: sortConfig.direction,
      };
      const response = await mockApi.fetchTransactions(params);
      setTransactions(response.data);
      setPagination((prev) => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      school_id: "",
      date_from: "",
      date_to: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadTransactions();
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="app" style={{ width: "100%", minHeight: "100vh" }}>
      <header className="header">
        <h1 style={{ color: "white" }}>School Payment Dashboard</h1>
      </header>

      <main className="content">
        {currentView === "overview" && (
          <>
            <div className="filters-section">
              <h3>
                <Filter size={20} /> Filter Transactions
              </h3>
              <div className="filters-grid">
                {/* Search */}
                <div className="form-group">
                  <label>Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="form-control"
                  >
                    <option value="">All</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* School */}
                <div className="form-group">
                  <label>School ID</label>
                  <input
                    type="text"
                    value={filters.school_id}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        school_id: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>

                {/* Date from */}
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        date_from: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>

                {/* Date to */}
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        date_to: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button className="btn btn-primary" onClick={loadTransactions}>
                  <Search size={16} /> Apply Filters
                </button>
                <button className="btn btn-secondary" onClick={clearFilters}>
                  <XCircle size={16} /> Clear Filters
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="transactions-table">
              {loading ? (
                <Loader size={32} />
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Collect ID</th>
                      <th>School ID</th>
                      <th>Gateway</th>
                      <th>Order Amount</th>
                      <th>Transaction Amount</th>
                      <th>Status</th>
                      <th>Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.collect_id}>
                        <td>{txn.collect_id}</td>
                        <td>{txn.school_id}</td>
                        <td>{txn.gateway}</td>
                        <td>{formatCurrency(txn.order_amount)}</td>
                        <td>{formatCurrency(txn.transaction_amount)}</td>
                        <td>
                          <span
                            style={{
                              color: getStatusColor(txn.status),
                              fontWeight: "bold",
                            }}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td>{txn.custom_order_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SchoolPaymentDashboard;
