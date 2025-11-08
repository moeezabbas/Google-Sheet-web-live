import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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

const ExternalLink = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// PRE-CONFIGURED GOOGLE SHEET ID
const DEFAULT_SHEET_ID = '1YOUR_DEFAULT_SHEET_ID_HERE';

export default function Home() {
  const [sheetId, setSheetId] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('balance');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDR: 0,
    totalCR: 0,
    netPosition: 0
  });

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    let interval;
    if (connected && sheetId && autoRefresh) {
      interval = setInterval(() => {
        console.log('Auto-refreshing data...');
        fetchData();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [connected, sheetId, autoRefresh]);

  const initializeApp = async () => {
    try {
      setInitializing(true);
      const savedId = localStorage.getItem('ledger_sheet_id');
      
      if (savedId) {
        setSheetId(savedId);
        await fetchData(savedId);
        setConnected(true);
      } else if (DEFAULT_SHEET_ID && DEFAULT_SHEET_ID !== '1YOUR_DEFAULT_SHEET_ID_HERE') {
        setSheetId(DEFAULT_SHEET_ID);
        localStorage.setItem('ledger_sheet_id', DEFAULT_SHEET_ID);
        await fetchData(DEFAULT_SHEET_ID);
        setConnected(true);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to connect to default sheet. Please check the connection.');
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

      localStorage.setItem('ledger_sheet_id', id);
      await fetchData(id);
      setConnected(true);
      
    } catch (err) {
      setError(err.message || 'Failed to connect to Google Sheets');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (id = sheetId) => {
  if (!id) return;
  
  try {
    const extractedId = extractSheetId(id);
    
    const balanceResponse = await fetch(
      `https://docs.google.com/spreadsheets/d/${extractedId}/gviz/tq?tqx=out:json&sheet=Balance%20Sheet&t=${Date.now()}`
    );
    
    if (!balanceResponse.ok) {
      throw new Error('Could not access sheet. Make sure it is publicly accessible.');
    }

    const balanceText = await balanceResponse.text();
    const balanceJson = JSON.parse(balanceText.substring(47).slice(0, -2));
    
    const rows = balanceJson.table.rows || [];
    console.log('🔍 Total rows from sheet:', rows.length);

    const balanceData = [];
    let skippedRows = [];

    // Start from row 3 (index 2) - this should be the first customer
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      
      if (row && row.c) {
        const nameCell = row.c[0];
        const balanceCell = row.c[1];
        const drCrCell = row.c[2];
        const linkCell = row.c[3];
        
        // Get raw values
        const rawName = nameCell ? (nameCell.v || nameCell.f || '') : '';
        const rawBalance = balanceCell ? (balanceCell.v || balanceCell.f || '0') : '0';
        const rawDrCr = drCrCell ? (drCrCell.v || drCrCell.f || '') : '';
        const rawLink = linkCell ? (linkCell.v || linkCell.f || '') : '';

        // Clean and process data
        const cleanName = String(rawName).trim();
        
        // VERY PERMISSIVE FILTERING - Only skip completely empty rows
        if (!cleanName || cleanName === '') {
          skippedRows.push(`Row ${i+1}: Empty name`);
          continue;
        }

        // Skip only obvious header/total rows (be very specific)
        if (cleanName === 'Customer Name' || 
            cleanName === 'Total' ||
            cleanName === 'Count:' ||
            cleanName.toLowerCase() === 'count: 79') {
          skippedRows.push(`Row ${i+1}: Header/Total row - "${cleanName}"`);
          continue;
        }

        // Parse balance - handle currency format
        let cleanBalance = 0;
        if (typeof rawBalance === 'number') {
          cleanBalance = rawBalance;
        } else {
          const balanceText = String(rawBalance).replace(/[Rs.,\s]/g, '');
          cleanBalance = parseFloat(balanceText) || 0;
        }

        // Parse DR/CR - handle various formats
        let cleanDrCr = String(rawDrCr).trim().toUpperCase();
        if (cleanDrCr === 'NIII' || cleanDrCr === 'NILL' || cleanDrCr === 'NIL' || cleanDrCr === '') {
          cleanDrCr = 'NILL';
        } else if (cleanDrCr !== 'DR' && cleanDrCr !== 'CR') {
          cleanDrCr = 'NILL'; // Default to NILL for unknown values
        }

        balanceData.push({
          id: `customer-${i}-${cleanName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
          name: cleanName,
          balance: cleanBalance,
          drCr: cleanDrCr,
          link: String(rawLink).trim(),
          rowNumber: i + 1 // Add row number for debugging
        });
      } else {
        skippedRows.push(`Row ${i+1}: No cells data`);
      }
    }

    console.log(`✅ Parsed ${balanceData.length} customers, skipped ${skippedRows.length} rows`);
    console.log('📊 All parsed customers:', balanceData.map(c => ({ name: c.name, row: c.rowNumber })));
    console.log('❌ Skipped rows:', skippedRows);

    // Debug: Check if we have exactly 79 customers
    if (balanceData.length !== 79) {
      console.warn(`⚠️ Expected 79 customers but got ${balanceData.length}. Checking row data...`);
      
      // Log first few rows to see what's happening
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const row = rows[i];
        console.log(`Row ${i} (${i < 2 ? 'HEADER?' : 'CUSTOMER?'}):`, {
          hasCells: !!row.c,
          name: row.c && row.c[0] ? (row.c[0].v || row.c[0].f) : 'NO NAME',
          balance: row.c && row.c[1] ? (row.c[1].v || row.c[1].f) : 'NO BALANCE',
          drCr: row.c && row.c[2] ? (row.c[2].v || row.c[2].f) : 'NO DR/CR'
        });
      }
    }

    setBalanceSheet(balanceData);
    
    // Save complete data for customer pages
    localStorage.setItem('ledger_sheet_data', JSON.stringify({
      sheetId: extractedId,
      balanceData: balanceData,
      lastUpdated: new Date().toISOString(),
      totalCount: balanceData.length,
      skippedRows: skippedRows // Save skipped rows for debugging
    }));
    
    // Calculate statistics
    const drCustomers = balanceData.filter(item => item.drCr === 'DR');
    const crCustomers = balanceData.filter(item => item.drCr === 'CR');
    const nillCustomers = balanceData.filter(item => item.drCr === 'NILL');
    
    const totalDR = drCustomers.reduce((sum, item) => sum + Math.abs(item.balance), 0);
    const totalCR = crCustomers.reduce((sum, item) => sum + Math.abs(item.balance), 0);
    
    console.log(`📈 Stats: DR=${drCustomers.length}, CR=${crCustomers.length}, NILL=${nillCustomers.length}`);
    console.log(`💰 Totals: DR=Rs.${totalDR}, CR=Rs.${totalCR}`);

    setStats({
      totalCustomers: balanceData.length,
      totalDR,
      totalCR,
      netPosition: totalDR - totalCR
    });

    setLastUpdate(new Date());
    setError('');
    
  } catch (err) {
    console.error('❌ Fetch error:', err);
    setError('Failed to fetch data. Check sheet permissions and try again.');
  }
};

  const disconnect = () => {
    setConnected(false);
    setSheetId('');
    setBalanceSheet([]);
    localStorage.removeItem('ledger_sheet_id');
    localStorage.removeItem('ledger_sheet_data');
  };

  const resetToDefault = () => {
    localStorage.removeItem('ledger_sheet_id');
    localStorage.removeItem('ledger_sheet_data');
    window.location.reload();
  };

  const filteredData = balanceSheet.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'dr' && item.drCr === 'DR') ||
      (filterType === 'cr' && item.drCr === 'CR') ||
      (filterType === 'nill' && item.drCr === 'NILL');
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Ledger</h1>
          <p className="text-gray-600">Connecting to your sheet...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <>
        <Head>
          <title>Ledger Web App - Connect</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Example: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
                </p>
              </div>

              <button
                onClick={connectToSheet}
                disabled={!sheetId || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  <span>Sheet must be <strong>publicly accessible</strong> (Anyone with link can view)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Must have "Balance Sheet" tab with columns: Name, Balance, DR/CR, Link</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Data updates automatically every 30 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ledger Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Camera className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Ledger Dashboard</h1>
                  <p className="text-sm text-blue-100">Connected to Shared Sheet</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-blue-100 bg-white/20 px-3 py-1 rounded-lg">
                  Sheet: {sheetId.substring(0, 8)}...
                </div>
                
                {/* Auto-refresh Toggle */}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                    autoRefresh 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto On' : 'Auto Off'}
                </button>

                <button
                  onClick={() => fetchData()}
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Now
                </button>
                
                <button
                  onClick={resetToDefault}
                  className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-sm"
                >
                  Change Sheet
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Debug Info - Remove in production */}
<div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm">
  <strong>Debug Info:</strong> Sheet has {balanceSheet.length > 0 ? '79' : '?'} rows → Parsed {stats.totalCustomers} customers | 
  {stats.totalCustomers !== 79 && <span className="text-red-600 font-bold"> MISSING {79 - stats.totalCustomers} CUSTOMERS!</span>}
  Auto-refresh: {autoRefresh ? 'ON' : 'OFF'} | 
  Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
  <button 
    onClick={() => {
      const savedData = localStorage.getItem('ledger_sheet_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('🔍 Full debug data:', data);
        alert(`Check console for full debug info.\nParsed: ${data.balanceData.length} customers\nSkipped: ${data.skippedRows ? data.skippedRows.length : 0} rows`);
      }
    }}
    className="ml-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded"
  >
    Debug Details
  </button>
</div>
            <button
              onClick={() => setViewMode('customers')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'customers' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Customer View
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
                </div>
                <Users className="w-10 h-10 lg:w-12 lg:h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total DR</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDR)}</p>
                </div>
                <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total CR</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCR)}</p>
                </div>
                <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Position</p>
                  <p className={`text-2xl font-bold ${stats.netPosition >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatCurrency(Math.abs(stats.netPosition))}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${viewMode === 'balance' ? 'customers' : 'by name'}...`}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('dr')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'dr' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  DR
                </button>
                <button
                  onClick={() => setFilterType('cr')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'cr' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  CR
                </button>
                <button
                  onClick={() => setFilterType('nill')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'nill' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  NILL
                </button>
              </div>
            </div>
          </div>

          {/* Balance Sheet View */}
          {viewMode === 'balance' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-2">
                <h2 className="text-xl font-bold">Balance Sheet</h2>
                {lastUpdate && (
                  <p className="text-sm text-blue-100">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                    {autoRefresh && ' (Auto-refresh ON)'}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer Name
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Balance (PKR)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        DR/CR
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((customer, index) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900 text-sm">{customer.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-gray-900 text-sm">
                            {formatCurrency(Math.abs(customer.balance))}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            customer.drCr === 'DR' 
                              ? 'bg-red-100 text-red-700' 
                              : customer.drCr === 'CR'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {customer.drCr}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link 
                              href={`/customer/${customer.id}`}
                              className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                            >
                              <User className="w-3 h-3 mr-1" />
                              View
                            </Link>
                            {customer.link && customer.link.includes('H_View') && (
                              <button
                                onClick={() => {
                                  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
                                  window.open(sheetUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Sheet
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No customers found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Cards View */}
          {viewMode === 'customers' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-2">
                <h2 className="text-xl font-bold">Customer Directory</h2>
                <p className="text-sm text-green-100">
                  {filteredData.length} customers found
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map((customer) => (
                    <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg truncate">
                          {customer.name}
                        </h3>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          customer.drCr === 'DR' 
                            ? 'bg-red-100 text-red-700' 
                            : customer.drCr === 'CR'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {customer.drCr}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Balance:</span>
                          <span className={`font-semibold ${
                            customer.drCr === 'DR' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(Math.abs(customer.balance))}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link 
                          href={`/customer/${customer.id}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Details
                        </Link>
                        {customer.link && customer.link.includes('H_View') && (
                          <button
                            onClick={() => {
                              const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
                              window.open(sheetUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Sheet
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No customers found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Data {autoRefresh ? 'syncs automatically every 30 seconds' : 'refresh is manual'}</p>
            <p className="mt-1">
              Showing {filteredData.length} of {balanceSheet.length} customers
              {viewMode === 'customers' && ' in card view'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
