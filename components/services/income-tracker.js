// Initialize Chart.js
let incomeChart;

// Initialize data
let incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];

// DOM Elements
const incomeForm = document.getElementById('incomeForm');
const incomeEntries = document.getElementById('incomeEntries');
const totalIncomeElement = document.getElementById('totalIncome');
const monthlyIncomeElement = document.getElementById('monthlyIncome');
const averageIncomeElement = document.getElementById('averageIncome');

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    incomeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Income Over Time',
                data: [],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Income Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            }
        }
    });
}

// Update statistics
function updateStats() {
    // Calculate total income
    const total = incomeData.reduce((sum, entry) => sum + entry.amount, 0);
    totalIncomeElement.textContent = formatCurrency(total);

    // Calculate monthly income
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = incomeData
        .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && 
                   entryDate.getFullYear() === currentYear;
        })
        .reduce((sum, entry) => sum + entry.amount, 0);
    monthlyIncomeElement.textContent = formatCurrency(monthlyTotal);

    // Calculate average income
    const average = incomeData.length > 0 ? total / incomeData.length : 0;
    averageIncomeElement.textContent = formatCurrency(average);

    // Update chart
    updateChart();
}

// Update chart data
function updateChart() {
    const sortedData = [...incomeData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    incomeChart.data.labels = sortedData.map(entry => formatDate(entry.date));
    incomeChart.data.datasets[0].data = sortedData.map(entry => entry.amount);
    incomeChart.update();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Add new income entry
function addIncomeEntry(entry) {
    incomeData.push(entry);
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    updateStats();
    renderIncomeEntries();
}

// Delete income entry
function deleteEntry(index) {
    incomeData.splice(index, 1);
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    updateStats();
    renderIncomeEntries();
}

// Render income entries
function renderIncomeEntries() {
    incomeEntries.innerHTML = '';
    
    incomeData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(entry.date)}</td>
                <td>${entry.source}</td>
                <td><span class="category-badge ${entry.category}">${entry.category}</span></td>
                <td>${formatCurrency(entry.amount)}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteEntry(${index})">
                        Delete
                    </button>
                </td>
            `;
            incomeEntries.appendChild(row);
        });
}

// Event Listeners
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        source: document.getElementById('incomeSource').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        date: document.getElementById('incomeDate').value,
        category: document.getElementById('incomeCategory').value
    };
    
    addIncomeEntry(newEntry);
    incomeForm.reset();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    updateStats();
    renderIncomeEntries();
});