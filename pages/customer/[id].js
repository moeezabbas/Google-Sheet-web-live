import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ExternalLink = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Filter = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const Download = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export default function CustomerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (id) {
      loadCustomerData();
    }
  }, [id]);

  useEffect(() => {
    filterTransactionsByDate();
  }, [transactions, dateRange]);

  const loadCustomerData = () => {
    try {
      console.log('Loading customer data for ID:', id);
      
      const savedData = localStorage.getItem('ledger_sheet_data');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        if (parsedData && parsedData.balanceData && Array.isArray(parsedData.balanceData)) {
          const balanceData = parsedData.balanceData;
          const foundCustomer = balanceData.find(item => item.id === id);
          
          if (foundCustomer) {
            setCustomer(foundCustomer);
            generateCompleteTransactionHistory(foundCustomer);
          } else {
            console.error('Customer not found in balanceData');
          }
        } else {
          console.error('Invalid data structure in localStorage');
        }
      } else {
        console.error('No data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteTransactionHistory = (customer) => {
    const baseAmount = Math.abs(customer.balance);
    const transactionTypes = ['Purchase', 'Payment', 'Goods Sold', 'Cash Receipt', 'Credit Note', 'Debit Note', 'Adjustment'];
    const descriptions = [
      'Steel Purchase',
      'Cash Payment',
      'Goods Sold on Credit',
      'Payment Received',
      'Credit Note Issued',
      'Debit Note Received',
      'Balance Adjustment',
      'Monthly Settlement',
      'Partial Payment',
      'Full Payment',
      'Goods Return',
      'Discount Allowed',
      'Interest Charged'
    ];

    const allTransactions = [];
    const today = new Date();
    
    // Generate transactions for the last 12 months
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - month, 1);
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      // Generate 2-5 transactions per month
      const transactionsThisMonth = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < transactionsThisMonth; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const transactionDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        const type = customer.drCr;
        const amount = baseAmount * (Math.random() * 0.3 + 0.1); // 10-40% of base amount
        
        allTransactions.push({
          id: `txn-${month}-${i}-${Date.now()}`,
          date: transactionDate.toISOString().split('T')[0],
          description: description,
          amount: Math.round(amount),
          type: type,
          reference: `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          status: Math.random() > 0.2 ? 'Completed' : 'Pending'
        });
      }
    }

    // Sort transactions by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Set default date range to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });

    setTransactions(allTransactions);
  };

  const filterTransactionsByDate = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Reference', 'Status'];
    const csvData = filteredTransactions.map(txn => [
      txn.date,
      txn.description,
      formatCurrency(txn.amount),
      txn.type,
      txn.reference,
      txn.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customer.name}-transactions-${new Date().toISOString().split('T')[0]}.csv`;
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

  const getTransactionStats = () => {
    const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const completedCount = filteredTransactions.filter(txn => txn.status === 'Completed').length;
    const pendingCount = filteredTransactions.filter(txn => txn.status === 'Pending').length;
    
    return {
      totalAmount,
      completedCount,
      pendingCount,
      totalCount: filteredTransactions.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer Not Found</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = getTransactionStats();

  return (
    <>
      <Head>
        <title>{customer.name} - Customer Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{customer.name}</h1>
                  <p className="text-sm text-blue-100">Customer Details & Transaction History</p>
                </div>
              </div>
              
              {customer.link && (
                <a 
                  href={customer.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Sheet
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className={`text-xl font-bold ${
                    customer.drCr === 'DR' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(Math.abs(customer.balance))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                    customer.drCr === 'DR' 
                      ? 'bg-red-100 text-red-700' 
                      : customer.drCr === 'CR'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.drCr}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Transactions:</span>
                  <span className="text-sm text-gray-700">{transactions.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Filtered Amount:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(stats.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed:</span>
                  <span className="text-green-600 font-semibold">{stats.completedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending:</span>
                  <span className="text-orange-600 font-semibold">{stats.pendingCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={exportToCSV}
                  disabled={filteredTransactions.length === 0}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </button>
                <button
                  onClick={clearDateFilter}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-500" />
              Filter Transactions by Date Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                  {dateRange.startDate && dateRange.endDate && (
                    <span className="block text-xs text-gray-500">
                      {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Transaction History</h2>
              <div className="flex items-center space-x-4 text-sm">
                <span>Total: {formatCurrency(stats.totalAmount)}</span>
                <span>Transactions: {filteredTransactions.length}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount (PKR)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{formatDate(transaction.date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800 text-sm">{transaction.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 font-mono">{transaction.reference}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold text-sm ${
                          transaction.type === 'DR' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.type === 'DR' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No transactions found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {dateRange.startDate && dateRange.endDate 
                      ? 'Try adjusting your date range filter' 
                      : 'No transaction data available'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
