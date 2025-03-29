// Initialize Chart.js
let expenseChart;

// Initialize data
let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [];

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseEntries = document.getElementById('expenseEntries');
const totalExpensesElement = document.getElementById('totalExpenses');
const monthlyExpensesElement = document.getElementById('monthlyExpenses');
const averageExpenseElement = document.getElementById('averageExpense');

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses Over Time',
                data: [],
                borderColor: '#e63946',
                backgroundColor: 'rgba(230, 57, 70, 0.5)',
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
                    text: 'Expense Trend'
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
    // Calculate total expenses
    const total = expenseData.reduce((sum, entry) => sum + entry.amount, 0);
    totalExpensesElement.textContent = formatCurrency(total);

    // Calculate monthly expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = expenseData
        .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && 
                   entryDate.getFullYear() === currentYear;
        })
        .reduce((sum, entry) => sum + entry.amount, 0);
    monthlyExpensesElement.textContent = formatCurrency(monthlyTotal);

    // Calculate average expense
    const average = expenseData.length > 0 ? total / expenseData.length : 0;
    averageExpenseElement.textContent = formatCurrency(average);

    // Update chart
    updateChart();
}

// Update chart data
function updateChart() {
    const sortedData = [...expenseData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    expenseChart.data.labels = sortedData.map(entry => formatDate(entry.date));
    expenseChart.data.datasets[0].data = sortedData.map(entry => entry.amount);
    expenseChart.update();
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

// Add new expense entry
function addExpenseEntry(entry) {
    expenseData.push(entry);
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
    updateStats();
    renderExpenseEntries();
}

// Delete expense entry
function deleteEntry(index) {
    expenseData.splice(index, 1);
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
    updateStats();
    renderExpenseEntries();
}

// Render expense entries
function renderExpenseEntries() {
    expenseEntries.innerHTML = '';
    
    expenseData
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
            expenseEntries.appendChild(row);
        });
}

// Event Listeners
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        source: document.getElementById('expenseSource').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        date: document.getElementById('expenseDate').value,
        category: document.getElementById('expenseCategory').value
    };
    
    addExpenseEntry(newEntry);
    expenseForm.reset();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    updateStats();
    renderExpenseEntries();
});