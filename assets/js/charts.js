/**
 * Finance Tracker - Charts JavaScript
 * Handles chart creation and visualization
 */

// Check if canvas is supported
const isCanvasSupported = function() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!isCanvasSupported()) {
        console.error('Canvas is not supported in this browser');
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.innerHTML = '<div class="no-data-message">Charts are not supported in your browser.</div>';
        });
        return;
    }
    
    // Initialize overview chart on homepage if it exists
    const overviewChartCanvas = document.getElementById('overview-chart');
    if (overviewChartCanvas) {
        initializeOverviewChart();
    }
    
    // Initialize income chart if it exists
    const incomeChartCanvas = document.getElementById('income-chart');
    if (incomeChartCanvas) {
        initializeIncomeChart();
    }
    
    // Initialize expense chart if it exists
    const expenseChartCanvas = document.getElementById('expense-chart');
    if (expenseChartCanvas) {
        initializeExpenseChart();
    }
});

/**
 * Initialize overview chart on homepage
 */
function initializeOverviewChart() {
    const ctx = document.getElementById('overview-chart').getContext('2d');
    
    // Sample data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = [3000, 3200, 3100, 3400, 3200, 3500];
    const expenseData = [2500, 2700, 2400, 2800, 2600, 2900];
    const savingsData = incomeData.map((income, i) => income - expenseData[i]);
    
    // Create chart
    const overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(92, 184, 92, 0.7)',
                    borderColor: 'rgba(92, 184, 92, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(217, 83, 79, 0.7)',
                    borderColor: 'rgba(217, 83, 79, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Savings',
                    data: savingsData,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Financial Overview',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize income chart
 */
function initializeIncomeChart() {
    const ctx = document.getElementById('income-chart').getContext('2d');
    
    // Try to get data from local storage
    let incomeData = [];
    try {
        const storedData = localStorage.getItem('incomeData');
        if (storedData) {
            incomeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading income data from local storage:', error);
    }
    
    // If no data or error, use sample data
    if (!incomeData || !incomeData.length) {
        // Sample data for demonstration
        incomeData = [
            { category: 'Salary', amount: 3000 },
            { category: 'Freelance', amount: 800 },
            { category: 'Investments', amount: 400 },
            { category: 'Other', amount: 200 }
        ];
    } else {
        // Process real data - group by category
        const categoryMap = {};
        incomeData.forEach(item => {
            if (!categoryMap[item.category]) {
                categoryMap[item.category] = 0;
            }
            categoryMap[item.category] += parseFloat(item.amount);
        });
        
        // Convert to array format for chart
        incomeData = Object.keys(categoryMap).map(category => ({
            category: category,
            amount: categoryMap[category]
        }));
    }
    
    // Chart colors
    const backgroundColors = [
        'rgba(92, 184, 92, 0.7)',
        'rgba(74, 111, 165, 0.7)',
        'rgba(240, 173, 78, 0.7)',
        'rgba(91, 192, 222, 0.7)',
        'rgba(153, 102, 204, 0.7)',
        'rgba(255, 127, 80, 0.7)'
    ];
    
    const borderColors = [
        'rgba(92, 184, 92, 1)',
        'rgba(74, 111, 165, 1)',
        'rgba(240, 173, 78, 1)',
        'rgba(91, 192, 222, 1)',
        'rgba(153, 102, 204, 1)',
        'rgba(255, 127, 80, 1)'
    ];
    
    // Create chart
    const incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: incomeData.map(item => item.category),
            datasets: [{
                data: incomeData.map(item => item.amount),
                backgroundColor: backgroundColors.slice(0, incomeData.length),
                borderColor: borderColors.slice(0, incomeData.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Income by Category',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return context.label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize expense chart
 */
function initializeExpenseChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    // Try to get data from local storage
    let expenseData = [];
    try {
        const storedData = localStorage.getItem('expenseData');
        if (storedData) {
            expenseData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading expense data from local storage:', error);
    }
    
    // If no data or error, use sample data
    if (!expenseData || !expenseData.length) {
        // Sample data for demonstration
        expenseData = [
            { category: 'Housing', amount: 1200 },
            { category: 'Food', amount: 500 },
            { category: 'Transportation', amount: 300 },
            { category: 'Utilities', amount: 200 },
            { category: 'Entertainment', amount: 150 },
            { category: 'Healthcare', amount: 100 },
            { category: 'Other', amount: 250 }
        ];
    } else {
        // Process real data - group by category
        const categoryMap = {};
        expenseData.forEach(item => {
            if (!categoryMap[item.category]) {
                categoryMap[item.category] = 0;
            }
            categoryMap[item.category] += parseFloat(item.amount);
        });
        
        // Convert to array format for chart
        expenseData = Object.keys(categoryMap).map(category => ({
            category: category,
            amount: categoryMap[category]
        }));
    }
    
    // Chart colors
    const backgroundColors = [
        'rgba(217, 83, 79, 0.7)',
        'rgba(240, 173, 78, 0.7)',
        'rgba(74, 111, 165, 0.7)',
        'rgba(91, 192, 222, 0.7)',
        'rgba(153, 102, 204, 0.7)',
        'rgba(255, 127, 80, 0.7)',
        'rgba(32, 178, 170, 0.7)',
        'rgba(240, 128, 128, 0.7)'
    ];
    
    const borderColors = [
        'rgba(217, 83, 79, 1)',
        'rgba(240, 173, 78, 1)',
        'rgba(74, 111, 165, 1)',
        'rgba(91, 192, 222, 1)',
        'rgba(153, 102, 204, 1)',
        'rgba(255, 127, 80, 1)',
        'rgba(32, 178, 170, 1)',
        'rgba(240, 128, 128, 1)'
    ];
    
    // Create chart
    const expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenseData.map(item => item.category),
            datasets: [{
                data: expenseData.map(item => item.amount),
                backgroundColor: backgroundColors.slice(0, expenseData.length),
                borderColor: borderColors.slice(0, expenseData.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Expenses by Category',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return context.label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create a bar chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Array} labels - Array of labels
 * @param {Array} data - Array of data values
 * @param {string} title - Chart title
 * @param {string} xAxisLabel - X-axis label
 * @param {string} yAxisLabel - Y-axis label
 */
function createBarChart(canvasId, labels, data, title, xAxisLabel, yAxisLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: 'rgba(74, 111, 165, 0.7)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: xAxisLabel
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Create a line chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Array} labels - Array of labels
 * @param {Array} data - Array of data values
 * @param {string} title - Chart title
 * @param {string} xAxisLabel - X-axis label
 * @param {string} yAxisLabel - Y-axis label
 */
function createLineChart(canvasId, labels, data, title, xAxisLabel, yAxisLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: 'rgba(74, 111, 165, 0.1)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: xAxisLabel
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Create a pie or doughnut chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Array} labels - Array of labels
 * @param {Array} data - Array of data values
 * @param {string} title - Chart title
 * @param {string} type - Chart type ('pie' or 'doughnut')
 */
function createPieChart(canvasId, labels, data, title, type = 'pie') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Chart colors
    const backgroundColors = [
        'rgba(74, 111, 165, 0.7)',
        'rgba(92, 184, 92, 0.7)',
        'rgba(240, 173, 78, 0.7)',
        'rgba(217, 83, 79, 0.7)',
        'rgba(91, 192, 222, 0.7)',
        'rgba(153, 102, 204, 0.7)',
        'rgba(255, 127, 80, 0.7)',
        'rgba(32, 178, 170, 0.7)'
    ];
    
    const borderColors = [
        'rgba(74, 111, 165, 1)',
        'rgba(92, 184, 92, 1)',
        'rgba(240, 173, 78, 1)',
        'rgba(217, 83, 79, 1)',
        'rgba(91, 192, 222, 1)',
        'rgba(153, 102, 204, 1)',
        'rgba(255, 127, 80, 1)',
        'rgba(32, 178, 170, 1)'
    ];
    
    const chart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length),
                borderColor: borderColors.slice(0, data.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return context.label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
    
    return chart;
}