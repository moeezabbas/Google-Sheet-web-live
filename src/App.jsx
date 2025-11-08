import React, { useState, useEffect } from 'react';

// SVG Icons
const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const RefreshCw = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Download = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Filter = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const ExternalLink = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Default Sheet ID
const DEFAULT_SHEET_ID = '1F1X-2FVVUKQUs4HSsGpgb1Qqk7-zieKtd_E29teQ7x0';

export default function LedgerApp() {
  // Main state
  const [sheetId, setSheetId] = useState(DEFAULT_SHEET_ID);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // View state
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard or customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('balance');
  
  // Customer detail state
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Auto-refresh
  useEffect(() => {
    let interval;
    if (connected && sheetId && autoRefresh && currentView === 'dashboard') {
      interval = setInterval(() => {
        console.log('Auto-refreshing data...');
        fetchBalanceSheet();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [connected, sheetId, autoRefresh, currentView]);

  const initializeApp = async () => {
    try {
      setInitializing(true);
      if (DEFAULT_SHEET_ID && DEFAULT_SHEET_ID !== '1YOUR_DEFAULT_SHEET_ID_HERE') {
        await fetchBalanceSheet(DEFAULT_SHEET_ID);
        setConnected(true);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to connect to default sheet.');
    } finally {
      setInitializing(false);
    }
  };

  const extractSheetId = (input) => {
    if (!input) return '';
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : input;
  };

  const connectToSheet = async () => {
    setLoading(true);
    setError('');
    
    try {
      const id = extractSheetId(sheetId);
      
      if (!id || id.length < 20) {
        throw new Error('Invalid Google Sheets ID or URL');
      }

      await fetchBalanceSheet(id);
      setConnected(true);
      
    } catch (err) {
      setError(err.message || 'Failed to connect to Google Sheets');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceSheet = async (id = sheetId) => {
    if (!id) return;
    
    try {
      const extractedId = extractSheetId(id);
      
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${extractedId}/gviz/tq?tqx=out:json&sheet=Balance%20Sheet&t=${Date.now()}`
      );
      
      if (!response.ok) {
        throw new Error('Could not access sheet. Make sure it is publicly accessible.');
      }

      const text = await response.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      const rows = json.table.rows || [];
      const balanceData = [];

      // Find start row (skip headers)
      let startRow = 0;
      for (let i = 0; i < Math.min(10, rows.length); i++) {
        const row = rows[i];
        if (row && row.c && row.c[0]) {
          const name = String(row.c[0].v || '').trim();
          if (name && 
              name !== 'Customer Name' && 
              !name.toLowerCase().includes('total') &&
              name !== 'Count:' &&
              name.length > 1) {
            startRow = i;
            break;
          }
        }
      }

      // Parse all customer rows
      for (let i = startRow; i < rows.length; i++) {
        const row = rows[i];
        
        if (row && row.c) {
          const nameCell = row.c[0];
          const balanceCell = row.c[1];
          const drCrCell = row.c[2];
          const linkCell = row.c[3];
          
          const rawName = nameCell ? (nameCell.v || nameCell.f || '') : '';
          const cleanName = String(rawName).trim();
          
          // Skip empty or header rows
          if (!cleanName || 
              cleanName === 'Customer Name' || 
              cleanName === 'Total' ||
              cleanName === 'Count:' ||
              cleanName.toLowerCase().includes('count:') ||
              cleanName.toLowerCase().includes('total ')) {
            continue;
          }

          // Parse balance
          const rawBalance = balanceCell ? (balanceCell.v || balanceCell.f || '0') : '0';
          let cleanBalance = 0;
          if (typeof rawBalance === 'number') {
            cleanBalance = rawBalance;
          } else {
            const balanceText = String(rawBalance).replace(/[Rs.,\s]/g, '');
            cleanBalance = parseFloat(balanceText) || 0;
          }

          // Parse DR/CR
          const rawDrCr = drCrCell ? (drCrCell.v || drCrCell.f || '') : '';
          let cleanDrCr = String(rawDrCr).trim().toUpperCase();
          if (cleanDrCr === 'NIII' || cleanDrCr === 'NILL' || cleanDrCr === 'NIL' || cleanDrCr === '') {
            cleanDrCr = 'NILL';
          } else if (cleanDrCr !== 'DR' && cleanDrCr !== 'CR') {
            cleanDrCr = 'NILL';
          }

          const rawLink = linkCell ? (linkCell.v || linkCell.f || '') : '';

          balanceData.push({
            id: `customer-${i}-${cleanName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
            name: cleanName,
            balance: cleanBalance,
            drCr: cleanDrCr,
            link: String(rawLink).trim(),
            sheetName: cleanName.replace(/[^a-zA-Z0-9]/g, '_'),
            rowNumber: i + 1
          });
        }
      }

      setBalanceSheet(balanceData);
      setLastUpdate(new Date());
      setError('');
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data. Check sheet permissions and try again.');
    }
  };

  const fetchCustomerTransactions = async (customer) => {
    setLoadingTransactions(true);
    
    try {
      const extractedId = extractSheetId(sheetId);
      
      // Try to fetch from customer's specific sheet
      const sheetName = encodeURIComponent(customer.sheetName || customer.name);
      
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${extractedId}/gviz/tq?tqx=out:json&sheet=${sheetName}&t=${Date.now()}`
      );
      
      if (!response.ok) {
        throw new Error('Customer transaction sheet not found');
      }

      const text = await response.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      const rows = json.table.rows || [];
      const transactions = [];

      // Find header row
      let headerRow = -1;
      for (let i = 0; i < Math.min(20, rows.length); i++) {
        const row = rows[i];
        if (row && row.c && row.c[0]) {
          const firstCell = String(row.c[0].v || '').toLowerCase();
          if (firstCell.includes('date') || firstCell.includes('transaction')) {
            headerRow = i;
            break;
          }
        }
      }

      const dataStartRow = headerRow >= 0 ? headerRow + 1 : 0;

      // Parse transactions (expecting: Date, Description, Amount, Type, Reference, Status)
      for (let i = dataStartRow; i < rows.length; i++) {
        const row = rows[i];
        
        if (row && row.c) {
          const dateCell = row.c[0];
          const descCell = row.c[1];
          const amountCell = row.c[2];
          const typeCell = row.c[3];
          const refCell = row.c[4];
          const statusCell = row.c[5];
          
          const dateVal = dateCell ? (dateCell.v || dateCell.f || '') : '';
          const descVal = descCell ? (descCell.v || descCell.f || '') : '';
          const amountVal = amountCell ? (amountCell.v || amountCell.f || 0) : 0;
          const typeVal = typeCell ? (typeCell.v || typeCell.f || '') : '';
          const refVal = refCell ? (refCell.v || refCell.f || '') : '';
          const statusVal = statusCell ? (statusCell.v || statusCell.f || 'Completed') : 'Completed';
          
          if (!dateVal || !descVal) continue;
          
          // Parse date
          let transactionDate;
          if (typeof dateVal === 'string') {
            transactionDate = dateVal;
          } else if (dateVal instanceof Date) {
            transactionDate = dateVal.toISOString().split('T')[0];
          } else {
            // Google Sheets date serial number
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + dateVal * 86400000);
            transactionDate = date.toISOString().split('T')[0];
          }
          
          transactions.push({
            id: `txn-${i}-${Date.now()}`,
            date: transactionDate,
            description: String(descVal).trim(),
            amount: parseFloat(amountVal) || 0,
            type: String(typeVal).trim().toUpperCase() || customer.drCr,
            reference: String(refVal).trim() || `REF-${i}`,
            status: String(statusVal).trim() || 'Completed'
          });
        }
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Set default date range to last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      setDateRange({
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      });

      setCustomerTransactions(transactions);
      
    } catch (err) {
      console.error('Transaction fetch error:', err);
      // Generate sample data if sheet doesn't exist
      generateSampleTransactions(customer);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const generateSampleTransactions = (customer) => {
    const transactions = [];
    const today = new Date();
    const baseAmount = Math.abs(customer.balance);
    
    const descriptions = [
      'Steel Purchase', 'Cash Payment', 'Goods Sold', 'Payment Received',
      'Credit Note', 'Debit Note', 'Balance Adjustment', 'Monthly Settlement'
    ];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - month, 1);
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      const txCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < txCount; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const txDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        transactions.push({
          id: `txn-${month}-${i}-${Date.now()}`,
          date: txDate.toISOString().split('T')[0],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          amount: Math.round(baseAmount * (Math.random() * 0.3 + 0.1)),
          type: customer.drCr,
          reference: `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          status: Math.random() > 0.2 ? 'Completed' : 'Pending'
        });
      }
    }

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const today2 = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today2.toISOString().split('T')[0]
    });

    setCustomerTransactions(transactions);
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('customer');
    fetchCustomerTransactions(customer);
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCustomer(null);
    setCustomerTransactions([]);
  };

  const getFilteredTransactions = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return customerTransactions;
    }

    return customerTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return txDate >= start && txDate <= end;
    });
  };

  const exportToCSV = () => {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) return;

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Reference', 'Status'];
    const csvData = filtered.map(tx => [
      tx.date,
      tx.description,
      formatCurrency(tx.amount),
      tx.type,
      tx.reference,
      tx.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCustomer.name}-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBalanceData = balanceSheet.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'dr' && item.drCr === 'DR') ||
      (filterType === 'cr' && item.drCr === 'CR') ||
      (filterType === 'nill' && item.drCr === 'NILL');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalCustomers: balanceSheet.length,
    totalDR: balanceSheet.filter(c => c.drCr === 'DR').reduce((sum, c) => sum + Math.abs(c.balance), 0),
    totalCR: balanceSheet.filter(c => c.drCr === 'CR').reduce((sum, c) => sum + Math.abs(c.balance), 0),
    get netPosition() { return this.totalDR - this.totalCR; }
  };

  // LOADING STATE
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Loading Ledger</h1>
          <p className="text-sm sm:text-base text-gray-600">Connecting to your sheet...</p>
        </div>
      </div>
    );
  }

  // CONNECTION SCREEN
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Ledger Web App</h1>
            <p className="text-gray-600">Connect to your Google Sheets ledger for live updates</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Sheets URL or ID
              </label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Paste full URL or sheet ID here"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={connectToSheet}
              disabled={!sheetId || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to Sheet'
              )}
            </button>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
              Setup Requirements
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sheet must be publicly accessible</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Must have "Balance Sheet" tab with columns: Name, Balance, DR/CR, Link</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Each customer can have their own transaction sheet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER DETAIL VIEW
  if (currentView === 'customer' && selectedCustomer) {
    const filteredTx = getFilteredTransactions();
    const txStats = {
      totalAmount: filteredTx.reduce((sum, tx) => sum + tx.amount, 0),
      completed: filteredTx.filter(tx => tx.status === 'Completed').length,
      pending: filteredTx.filter(tx => tx.status === 'Pending').length
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={backToDashboard}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold truncate">{selectedCustomer.name}</h1>
                <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">Customer Details & Transaction History</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Customer Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Account Summary</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Balance:</span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    selectedCustomer.drCr === 'DR' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(Math.abs(selectedCustomer.balance))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                  <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-bold
