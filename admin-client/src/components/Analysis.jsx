import { useState, useEffect, useRef } from 'react';
import axios from '../utils/axios';
import {
    BarChart, PieChart, RefreshCw, AlertCircle,
    Calendar, Filter, Download, Search, FileText,
    LineChart, AreaChart, Activity
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analysis = () => {
    const [complaints, setComplaints] = useState([]);
    const [outpasses, setOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('all'); // all, month, week
    const [exportFormat, setExportFormat] = useState('csv');

    // Chart type preferences
    const [chartTypes, setChartTypes] = useState({
        complaintsByCategory: 'bar',  // bar, pie, doughnut
        complaintsByStatus: 'doughnut', // bar, pie, doughnut
        outpassesByType: 'pie', // bar, pie, doughnut
        outpassesByStatus: 'bar' // bar, pie, doughnut
    });

    // Time-based data for trend analysis
    const [timeBasedData, setTimeBasedData] = useState({
        complaints: [],
        outpasses: []
    });

    // Chart refs for responsiveness
    const chartRefs = {
        complaintsByCategory: useRef(null),
        complaintsByStatus: useRef(null),
        outpassesByType: useRef(null),
        outpassesByStatus: useRef(null),
        trends: useRef(null)
    };

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch complaints
            const complaintsResponse = await axios.get('/admin-api/get-complaints');

            // Fetch outpasses
            const outpassesResponse = await axios.get('/admin-api/all-outpasses');

            // Get raw data
            const allComplaints = complaintsResponse.data || [];
            const allOutpasses = Array.isArray(outpassesResponse.data)
                ? outpassesResponse.data
                : outpassesResponse.data.outpasses || [];

            // Process data based on time range
            const filteredComplaints = filterDataByTimeRange(allComplaints, timeRange);
            const filteredOutpasses = filterDataByTimeRange(allOutpasses, timeRange);

            // Generate time-based data for trend analysis
            const timeData = generateTimeBasedData(allComplaints, allOutpasses);

            setComplaints(filteredComplaints);
            setOutpasses(filteredOutpasses);
            setTimeBasedData(timeData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Generate time-based data for trend analysis
    const generateTimeBasedData = (allComplaints, allOutpasses) => {
        // Get the last 6 months
        const months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: month.toLocaleString('default', { month: 'short' }),
                year: month.getFullYear(),
                monthIndex: month.getMonth(),
                fullYear: month.getFullYear()
            });
        }

        // Count complaints and outpasses by month
        const complaintsByMonth = months.map(monthData => {
            const count = allComplaints.filter(complaint => {
                const date = new Date(complaint.createdAt || complaint.dateTime);
                return date.getMonth() === monthData.monthIndex &&
                       date.getFullYear() === monthData.fullYear;
            }).length;

            return {
                month: `${monthData.month} ${monthData.year}`,
                count
            };
        });

        const outpassesByMonth = months.map(monthData => {
            const count = allOutpasses.filter(outpass => {
                const date = new Date(outpass.createdAt || outpass.dateTime || outpass.date);
                return date.getMonth() === monthData.monthIndex &&
                       date.getFullYear() === monthData.fullYear;
            }).length;

            return {
                month: `${monthData.month} ${monthData.year}`,
                count
            };
        });

        return {
            complaints: complaintsByMonth,
            outpasses: outpassesByMonth,
            labels: complaintsByMonth.map(item => item.month)
        };
    };

    const filterDataByTimeRange = (data, range) => {
        if (!Array.isArray(data) || range === 'all') return data;

        const now = new Date();
        const cutoffDate = new Date();

        if (range === 'month') {
            cutoffDate.setMonth(now.getMonth() - 1);
        } else if (range === 'week') {
            cutoffDate.setDate(now.getDate() - 7);
        }

        return data.filter(item => {
            const itemDate = new Date(item.createdAt || item.dateTime || item.date);
            return itemDate >= cutoffDate;
        });
    };

    // Calculate complaint statistics by category
    const getComplaintsByCategory = () => {
        const categories = {};

        complaints.forEach(complaint => {
            const category = complaint.category || 'unknown';
            categories[category] = (categories[category] || 0) + 1;
        });

        return Object.entries(categories).map(([category, count]) => ({
            category,
            count,
            percentage: Math.round((count / complaints.length) * 100)
        })).sort((a, b) => b.count - a.count);
    };

    // Calculate complaint statistics by status
    const getComplaintsByStatus = () => {
        const statuses = {
            'active': 0,
            'solved': 0
        };

        complaints.forEach(complaint => {
            const status = complaint.status || 'active';
            statuses[status] = (statuses[status] || 0) + 1;
        });

        return Object.entries(statuses).map(([status, count]) => ({
            status,
            count,
            percentage: complaints.length ? Math.round((count / complaints.length) * 100) : 0
        }));
    };

    // Calculate outpass statistics by type
    const getOutpassesByType = () => {
        const types = {};

        outpasses.forEach(outpass => {
            const type = outpass.type || 'unknown';
            types[type] = (types[type] || 0) + 1;
        });

        return Object.entries(types).map(([type, count]) => ({
            type,
            count,
            percentage: outpasses.length ? Math.round((count / outpasses.length) * 100) : 0
        }));
    };

    // Calculate outpass statistics by status
    const getOutpassesByStatus = () => {
        const statuses = {
            'pending': 0,
            'accepted': 0,
            'approved': 0,
            'rejected': 0
        };

        outpasses.forEach(outpass => {
            let status = outpass.status || 'pending';
            // Normalize status names
            if (status === 'accepted') status = 'approved';
            statuses[status] = (statuses[status] || 0) + 1;
        });

        return Object.entries(statuses).map(([status, count]) => ({
            status,
            count,
            percentage: outpasses.length ? Math.round((count / outpasses.length) * 100) : 0
        }));
    };

    // Generate CSV data for export
    const generateCSV = (data, type) => {
        if (!data || !data.length) return '';

        let headers = [];
        let rows = [];

        if (type === 'complaints-category') {
            headers = ['Category', 'Count', 'Percentage'];
            rows = data.map(item => [
                item.category,
                item.count,
                `${item.percentage}%`
            ]);
        } else if (type === 'complaints-status') {
            headers = ['Status', 'Count', 'Percentage'];
            rows = data.map(item => [
                item.status,
                item.count,
                `${item.percentage}%`
            ]);
        } else if (type === 'outpasses-type') {
            headers = ['Type', 'Count', 'Percentage'];
            rows = data.map(item => [
                item.type,
                item.count,
                `${item.percentage}%`
            ]);
        } else if (type === 'outpasses-status') {
            headers = ['Status', 'Count', 'Percentage'];
            rows = data.map(item => [
                item.status,
                item.count,
                `${item.percentage}%`
            ]);
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    };

    // Handle export data
    const handleExport = (data, type) => {
        let content = '';
        let filename = '';
        let mimeType = '';

        if (exportFormat === 'csv') {
            content = generateCSV(data, type);
            mimeType = 'text/csv;charset=utf-8;';
            filename = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
        } else if (exportFormat === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json;charset=utf-8;';
            filename = `${type}-${new Date().toISOString().slice(0, 10)}.json`;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle chart type change
    const handleChartTypeChange = (chartKey, newType) => {
        setChartTypes(prev => ({
            ...prev,
            [chartKey]: newType
        }));
    };

    // Prepare chart data
    const prepareChartData = (data, keyField, valueField) => {
        if (!data || !data.length) return null;

        const labels = data.map(item => item[keyField]);
        const values = data.map(item => item[valueField]);
        const backgroundColors = data.map(item => getColorForCategory(item[keyField]));

        return {
            labels,
            datasets: [
                {
                    label: keyField === 'category' ? 'Complaints' :
                           keyField === 'status' && valueField === 'count' ? 'Status Count' :
                           keyField === 'type' ? 'Outpasses' : 'Status Count',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                }
            ]
        };
    };

    // Render chart based on type
    const renderChart = (data, keyField, valueField, chartKey) => {
        if (!data || !data.length) return null;

        const chartData = prepareChartData(data, keyField, valueField);
        const chartType = chartTypes[chartKey];

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#B0B0B0',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1E1E1E',
                    titleColor: '#FFFFFF',
                    bodyColor: '#B0B0B0',
                    borderColor: '#2D2D2D',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.dataset.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: chartType === 'bar' ? {
                x: {
                    grid: {
                        color: 'rgba(45, 45, 45, 0.5)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(45, 45, 45, 0.5)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    },
                    beginAtZero: true
                }
            } : undefined
        };

        const chartHeight = 300;

        return (
            <div className="chart-wrapper" style={{ height: `${chartHeight}px` }}>
                <div className="chart-type-selector">
                    <button
                        className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`}
                        onClick={() => handleChartTypeChange(chartKey, 'bar')}
                    >
                        <BarChart size={16} />
                    </button>
                    <button
                        className={`chart-type-button ${chartType === 'pie' ? 'active' : ''}`}
                        onClick={() => handleChartTypeChange(chartKey, 'pie')}
                    >
                        <PieChart size={16} />
                    </button>
                    <button
                        className={`chart-type-button ${chartType === 'doughnut' ? 'active' : ''}`}
                        onClick={() => handleChartTypeChange(chartKey, 'doughnut')}
                    >
                        <Activity size={16} />
                    </button>
                </div>

                {chartType === 'bar' && (
                    <Bar
                        ref={chartRefs[chartKey]}
                        data={chartData}
                        options={chartOptions}
                    />
                )}

                {chartType === 'pie' && (
                    <Pie
                        ref={chartRefs[chartKey]}
                        data={chartData}
                        options={chartOptions}
                    />
                )}

                {chartType === 'doughnut' && (
                    <Doughnut
                        ref={chartRefs[chartKey]}
                        data={chartData}
                        options={chartOptions}
                    />
                )}
            </div>
        );
    };

    // Render trend chart
    const renderTrendChart = () => {
        if (!timeBasedData.labels || !timeBasedData.labels.length) return null;

        const data = {
            labels: timeBasedData.labels,
            datasets: [
                {
                    label: 'Complaints',
                    data: timeBasedData.complaints.map(item => item.count),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Outpasses',
                    data: timeBasedData.outpasses.map(item => item.count),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#B0B0B0',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1E1E1E',
                    titleColor: '#FFFFFF',
                    bodyColor: '#B0B0B0',
                    borderColor: '#2D2D2D',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(45, 45, 45, 0.5)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(45, 45, 45, 0.5)'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    },
                    beginAtZero: true
                }
            }
        };

        return (
            <div className="chart-wrapper" style={{ height: '300px' }}>
                <Line
                    ref={chartRefs.trends}
                    data={data}
                    options={options}
                />
            </div>
        );
    };

    // Legacy render bar chart for data visualization (fallback)
    const renderBarChart = (data, keyField, valueField, colorField) => {
        if (!data || !data.length) return null;

        const maxValue = Math.max(...data.map(item => item[valueField]));

        return (
            <div className="chart-container">
                {data.map((item, index) => (
                    <div key={index} className="chart-bar-item">
                        <div className="chart-bar-label">
                            <span style={{ textTransform: 'capitalize' }}>{item[keyField]}</span>
                            <span className="chart-bar-value">{item[valueField]}</span>
                        </div>
                        <div className="chart-bar-container">
                            <div
                                className={`chart-bar ${colorField ? item[colorField] : ''}`}
                                style={{
                                    width: `${(item[valueField] / maxValue) * 100}%`,
                                    backgroundColor: getColorForCategory(item[keyField])
                                }}
                            ></div>
                        </div>
                        <div className="chart-bar-percentage">{item.percentage}%</div>
                    </div>
                ))}
            </div>
        );
    };

    // Get color for category
    const getColorForCategory = (category) => {
        const colors = {
            'network related': 'rgba(75, 192, 192, 0.7)',
            'food': 'rgba(255, 159, 64, 0.7)',
            'water': 'rgba(54, 162, 235, 0.7)',
            'power cut': 'rgba(255, 99, 132, 0.7)',
            'cleaning': 'rgba(153, 102, 255, 0.7)',
            'plumbing related': 'rgba(201, 203, 207, 0.7)',
            'electrician related': 'rgba(255, 205, 86, 0.7)',
            'carpenter related': 'rgba(75, 192, 192, 0.7)',
            'active': 'rgba(255, 159, 64, 0.7)',
            'solved': 'rgba(75, 192, 192, 0.7)',
            'pending': 'rgba(255, 205, 86, 0.7)',
            'approved': 'rgba(75, 192, 192, 0.7)',
            'accepted': 'rgba(75, 192, 192, 0.7)',
            'rejected': 'rgba(255, 99, 132, 0.7)',
            'late pass': 'rgba(54, 162, 235, 0.7)',
            'home pass': 'rgba(153, 102, 255, 0.7)'
        };

        return colors[category?.toLowerCase()] || 'rgba(0, 191, 166, 0.7)';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading analysis data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state">
                <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--error)' }} />
                <h3 className="empty-title" style={{ color: 'var(--error)' }}>Error</h3>
                <p className="empty-text">{error}</p>
                <button
                    className="admin-submit-button"
                    style={{ maxWidth: '200px' }}
                    onClick={fetchData}
                >
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    const complaintsByCategory = getComplaintsByCategory();
    const complaintsByStatus = getComplaintsByStatus();
    const outpassesByType = getOutpassesByType();
    const outpassesByStatus = getOutpassesByStatus();

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">
                        <BarChart size={24} color="var(--primary)" />
                        Data Analysis
                    </h3>

                    <div className="filter-buttons">
                        <button
                            className={`filter-button ${timeRange === 'all' ? 'active' : ''}`}
                            onClick={() => setTimeRange('all')}
                        >
                            <Calendar size={16} />
                            All Time
                        </button>
                        <button
                            className={`filter-button ${timeRange === 'month' ? 'active' : ''}`}
                            onClick={() => setTimeRange('month')}
                        >
                            <Calendar size={16} />
                            Last Month
                        </button>
                        <button
                            className={`filter-button ${timeRange === 'week' ? 'active' : ''}`}
                            onClick={() => setTimeRange('week')}
                        >
                            <Calendar size={16} />
                            Last Week
                        </button>
                        <button
                            className="filter-button"
                            onClick={fetchData}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="admin-card-body">
                    {/* Trend Analysis */}
                    <div className="analysis-card trend-card">
                        <div className="analysis-card-header">
                            <h4 className="analysis-card-title">
                                <LineChart size={18} />
                                6-Month Trend Analysis
                            </h4>
                            <div className="analysis-card-actions">
                                <button
                                    className="analysis-button"
                                    onClick={() => handleExport([
                                        ...timeBasedData.complaints.map(item => ({
                                            month: item.month,
                                            type: 'Complaints',
                                            count: item.count
                                        })),
                                        ...timeBasedData.outpasses.map(item => ({
                                            month: item.month,
                                            type: 'Outpasses',
                                            count: item.count
                                        }))
                                    ], 'trend-analysis')}
                                    disabled={!timeBasedData.labels || !timeBasedData.labels.length}
                                >
                                    <Download size={16} />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                        <div className="analysis-card-body">
                            {!timeBasedData.labels || !timeBasedData.labels.length ? (
                                <div className="analysis-empty">
                                    <FileText size={32} />
                                    <p>No trend data available</p>
                                </div>
                            ) : (
                                renderTrendChart()
                            )}
                        </div>
                        <div className="analysis-card-footer">
                            <div className="analysis-summary">
                                <div className="analysis-summary-item">
                                    <span className="analysis-summary-label">Total Complaints</span>
                                    <span className="analysis-summary-value">
                                        {timeBasedData.complaints.reduce((sum, item) => sum + item.count, 0)}
                                    </span>
                                </div>
                                <div className="analysis-summary-item">
                                    <span className="analysis-summary-label">Total Outpasses</span>
                                    <span className="analysis-summary-value">
                                        {timeBasedData.outpasses.reduce((sum, item) => sum + item.count, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="analysis-grid">
                        {/* Complaints by Category */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <h4 className="analysis-card-title">
                                    <PieChart size={18} />
                                    Complaints by Category
                                </h4>
                                <div className="analysis-card-actions">
                                    <select
                                        className="analysis-select"
                                        value={exportFormat}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="json">JSON</option>
                                    </select>
                                    <button
                                        className="analysis-button"
                                        onClick={() => handleExport(complaintsByCategory, 'complaints-category')}
                                        disabled={!complaintsByCategory.length}
                                    >
                                        <Download size={16} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="analysis-card-body">
                                {complaintsByCategory.length === 0 ? (
                                    <div className="analysis-empty">
                                        <FileText size={32} />
                                        <p>No complaint data available</p>
                                    </div>
                                ) : (
                                    renderChart(complaintsByCategory, 'category', 'count', 'complaintsByCategory')
                                )}
                            </div>
                            <div className="analysis-card-footer">
                                <div className="analysis-summary">
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Total Complaints</span>
                                        <span className="analysis-summary-value">{complaints.length}</span>
                                    </div>
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Categories</span>
                                        <span className="analysis-summary-value">{complaintsByCategory.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complaints by Status */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <h4 className="analysis-card-title">
                                    <PieChart size={18} />
                                    Complaints by Status
                                </h4>
                                <div className="analysis-card-actions">
                                    <button
                                        className="analysis-button"
                                        onClick={() => handleExport(complaintsByStatus, 'complaints-status')}
                                        disabled={!complaintsByStatus.length}
                                    >
                                        <Download size={16} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="analysis-card-body">
                                {complaintsByStatus.length === 0 ? (
                                    <div className="analysis-empty">
                                        <FileText size={32} />
                                        <p>No complaint data available</p>
                                    </div>
                                ) : (
                                    renderChart(complaintsByStatus, 'status', 'count', 'complaintsByStatus')
                                )}
                            </div>
                            <div className="analysis-card-footer">
                                <div className="analysis-summary">
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Solved Rate</span>
                                        <span className="analysis-summary-value">
                                            {complaints.length ?
                                                Math.round((complaints.filter(c => c.status === 'solved').length / complaints.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Active</span>
                                        <span className="analysis-summary-value">{complaints.filter(c => c.status !== 'solved').length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outpasses by Type */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <h4 className="analysis-card-title">
                                    <PieChart size={18} />
                                    Outpasses by Type
                                </h4>
                                <div className="analysis-card-actions">
                                    <button
                                        className="analysis-button"
                                        onClick={() => handleExport(outpassesByType, 'outpasses-type')}
                                        disabled={!outpassesByType.length}
                                    >
                                        <Download size={16} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="analysis-card-body">
                                {outpassesByType.length === 0 ? (
                                    <div className="analysis-empty">
                                        <FileText size={32} />
                                        <p>No outpass data available</p>
                                    </div>
                                ) : (
                                    renderChart(outpassesByType, 'type', 'count', 'outpassesByType')
                                )}
                            </div>
                            <div className="analysis-card-footer">
                                <div className="analysis-summary">
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Total Outpasses</span>
                                        <span className="analysis-summary-value">{outpasses.length}</span>
                                    </div>
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Types</span>
                                        <span className="analysis-summary-value">{outpassesByType.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outpasses by Status */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <h4 className="analysis-card-title">
                                    <PieChart size={18} />
                                    Outpasses by Status
                                </h4>
                                <div className="analysis-card-actions">
                                    <button
                                        className="analysis-button"
                                        onClick={() => handleExport(outpassesByStatus, 'outpasses-status')}
                                        disabled={!outpassesByStatus.length}
                                    >
                                        <Download size={16} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="analysis-card-body">
                                {outpassesByStatus.length === 0 ? (
                                    <div className="analysis-empty">
                                        <FileText size={32} />
                                        <p>No outpass data available</p>
                                    </div>
                                ) : (
                                    renderChart(outpassesByStatus, 'status', 'count', 'outpassesByStatus')
                                )}
                            </div>
                            <div className="analysis-card-footer">
                                <div className="analysis-summary">
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Approval Rate</span>
                                        <span className="analysis-summary-value">
                                            {outpasses.length ?
                                                Math.round((outpasses.filter(o =>
                                                    o.status === 'approved' || o.status === 'accepted'
                                                ).length / outpasses.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="analysis-summary-item">
                                        <span className="analysis-summary-label">Pending</span>
                                        <span className="analysis-summary-value">
                                            {outpasses.filter(o => o.status === 'pending').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
