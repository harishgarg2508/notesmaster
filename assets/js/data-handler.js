/**
 * Finance Tracker - Data Handler
 * Manages data operations (CRUD) for financial data
 */

/**
 * Generate a unique ID for data entries
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Add income entry
 * @param {Object} incomeData - Income data object
 * @returns {string} - ID of the new entry
 */
function addIncome(incomeData) {
    // Validate data
    if (!incomeData.source || !incomeData.amount || !incomeData.date || !incomeData.category) {
        throw new Error('Missing required income data fields');
    }
    
    // Format data
    const income = {
        id: generateId(),
        source: incomeData.source.trim(),
        amount: parseFloat(incomeData.amount),
        date: incomeData.date,
        category: incomeData.category,
        notes: incomeData.notes ? incomeData.notes.trim() : '',
        createdAt: new Date().toISOString()
    };
    
    // Get existing data
    let incomes = [];
    try {
        const storedIncomes = localStorage.getItem('incomeData');
        if (storedIncomes) {
            incomes = JSON.parse(storedIncomes);
        }
    } catch (error) {
        console.error('Error loading income data:', error);
    }
    
    // Add new income
    incomes.push(income);
    
    // Save to storage
    localStorage.setItem('incomeData', JSON.stringify(incomes));
    
    // Return the ID
    return income.id;
}

/**
 * Get all income entries
 * @returns {Array} - Array of income entries
 */
function getAllIncomes() {
    try {
        const storedIncomes = localStorage.getItem('incomeData');
        if (storedIncomes) {
            return JSON.parse(storedIncomes);
        }
    } catch (error) {
        console.error('Error loading income data:', error);
    }
    
    return [];
}

/**
 * Get income by ID
 * @param {string} id - Income ID
 * @returns {Object|null} - Income object or null if not found
 */
function getIncomeById(id) {
    const incomes = getAllIncomes();
    return incomes.find(income => income.id === id) || null;
}

/**
 * Update income entry
 * @param {string} id - Income ID
 * @param {Object} updatedData - Updated income data
 * @returns {boolean} - Success status
 */
function updateIncome(id, updatedData) {
    // Get existing data
    const incomes = getAllIncomes();
    const index = incomes.findIndex(income => income.id === id);
    
    if (index === -1) {
        return false;
    }
    
    // Update data
    incomes[index] = {
        ...incomes[index],
        source: updatedData.source ? updatedData.source.trim() : incomes[index].source,
        amount: updatedData.amount ? parseFloat(updatedData.amount) : incomes[index].amount,
        date: updatedData.date || incomes[index].date,
        category: updatedData.category || incomes[index].category,
        notes: updatedData.notes !== undefined ? updatedData.notes.trim() : incomes[index].notes,
        updatedAt: new Date().toISOString()
    };
    
    // Save to storage
    localStorage.setItem('incomeData', JSON.stringify(incomes));
    
    return true;
}

/**
 * Delete income entry
 * @param {string} id - Income ID
 * @returns {boolean} - Success status
 */
function deleteIncome(id) {
    // Get existing data
    const incomes = getAllIncomes();
    const filteredIncomes = incomes.filter(income => income.id !== id);
    
    if (filteredIncomes.length === incomes.length) {
        return false;
    }
    
    // Save to storage
    localStorage.setItem('incomeData', JSON.stringify(filteredIncomes));
    
    return true;
}

/**
 * Add expense entry
 * @param {Object} expenseData - Expense data object
 * @returns {string} - ID of the new entry
 */
function addExpense(expenseData) {
    // Validate data
    if (!expenseData.description || !expenseData.amount || !expenseData.date || !expenseData.category) {
        throw new Error('Missing required expense data fields');
    }
    
    // Format data
    const expense = {
        id: generateId(),
        description: expenseData.description.trim(),
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        category: expenseData.category,
        payment: expenseData.payment || 'cash',
        notes: expenseData.notes ? expenseData.notes.trim() : '',
        createdAt: new Date().toISOString()
    };
    
    // Get existing data
    let expenses = [];
    try {
        const storedExpenses = localStorage.getItem('expenseData');
        if (storedExpenses) {
            expenses = JSON.parse(storedExpenses);
        }
    } catch (error) {
        console.error('Error loading expense data:', error);
    }
    
    // Add new expense
    expenses.push(expense);
    
    // Save to storage
    localStorage.setItem('expenseData', JSON.stringify(expenses));
    
    // Return the ID
    return expense.id;
}

/**
 * Get all expense entries
 * @returns {Array} - Array of expense entries
 */
function getAllExpenses() {
    try {
        const storedExpenses = localStorage.getItem('expenseData');
        if (storedExpenses) {
            return JSON.parse(storedExpenses);
        }
    } catch (error) {
        console.error('Error loading expense data:', error);
    }
    
    return [];
}

/**
 * Get expense by ID
 * @param {string} id - Expense ID
 * @returns {Object|null} - Expense object or null if not found
 */
function getExpenseById(id) {
    const expenses = getAllExpenses();
    return expenses.find(expense => expense.id === id) || null;
}

/**
 * Update expense entry
 * @param {string} id - Expense ID
 * @param {Object} updatedData - Updated expense data
 * @returns {boolean} - Success status
 */
function updateExpense(id, updatedData) {
    // Get existing data
    const expenses = getAllExpenses();
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
        return false;
    }
    
    // Update data
    expenses[index] = {
        ...expenses[index],
        description: updatedData.description ? updatedData.description.trim() : expenses[index].description,
        amount: updatedData.amount ? parseFloat(updatedData.amount) : expenses[index].amount,
        date: updatedData.date || expenses[index].date,
        category: updatedData.category || expenses[index].category,
        payment: updatedData.payment || expenses[index].payment,
        notes: updatedData.notes !== undefined ? updatedData.notes.trim() : expenses[index].notes,
        updatedAt: new Date().toISOString()
    };
    
    // Save to storage
    localStorage.setItem('expenseData', JSON.stringify(expenses));
    
    return true;
}

/**
 * Delete expense entry
 * @param {string} id - Expense ID
 * @returns {boolean} - Success status
 */
function deleteExpense(id) {
    // Get existing data
    const expenses = getAllExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) {
        return false;
    }
    
    // Save to storage
    localStorage.setItem('expenseData', JSON.stringify(filteredExpenses));
    
    return true;
}

/**
 * Get financial summary
 * @returns {Object} - Financial summary object
 */
function getFinancialSummary() {
    const incomes = getAllIncomes();
    const expenses = getAllExpenses();
    
    // Calculate total income
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate balance
    const balance = totalIncome - totalExpenses;
    
    // Get current month data
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    });
    
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const monthlyIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
    const monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    // Calculate average monthly income and expenses
    const monthsMap = {};
    
    incomes.forEach(income => {
        const date = new Date(income.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!monthsMap[monthKey]) {
            monthsMap[monthKey] = { income: 0, expense: 0 };
        }
        
        monthsMap[monthKey].income += income.amount;
    });
    
    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!monthsMap[monthKey]) {
            monthsMap[monthKey] = { income: 0, expense: 0 };
        }
        
        monthsMap[monthKey].expense += expense.amount;
    });
    
    const months = Object.values(monthsMap);
    const avgMonthlyIncome = months.length ? months.reduce((sum, month) => sum + month.income, 0) / months.length : 0;
    const avgMonthlyExpenses = months.length ? months.reduce((sum, month) => sum + month.expense, 0) / months.length : 0;
    
    return {
        totalIncome,
        totalExpenses,
        balance,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        avgMonthlyIncome,
        avgMonthlyExpenses
    };
}

/**
 * Filter financial data by date range
 * @param {Array} data - Array of financial data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} - Filtered data
 */
function filterByDateRange(data, startDate, endDate) {
    if (!startDate && !endDate) {
        return data;
    }
    
    return data.filter(item => {
        const itemDate = new Date(item.date);
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return itemDate >= start && itemDate <= end;
        } else if (startDate) {
            const start = new Date(startDate);
            return itemDate >= start;
        } else if (endDate) {
            const end = new Date(endDate);
            return itemDate <= end;
        }
        
        return true;
    });
}

/**
 * Filter financial data by category
 * @param {Array} data - Array of financial data
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered data
 */
function filterByCategory(data, category) {
    if (!category || category === 'all') {
        return data;
    }
    
    return data.filter(item => item.category === category);
}

/**
 * Get monthly data for charts
 * @param {string} dataType - Type of data ('income' or 'expense')
 * @param {number} months - Number of months to include
 * @returns {Object} - Monthly data object with labels and values
 */
function getMonthlyData(dataType, months = 6) {
    const data = dataType === 'income' ? getAllIncomes() : getAllExpenses();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthLabels = [];
    const monthlyData = [];
    
    for (let i = 0; i < months; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        
        if (month < 0) {
            month += 12;
            year -= 1;
        }
        
        const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
        const monthLabel = `${monthName} ${year}`;
        monthLabels.unshift(monthLabel);
        
        const monthTotal = data.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getMonth() === month && itemDate.getFullYear() === year) {
                return sum + item.amount;
            }
            return sum;
        }, 0);
        
        monthlyData.unshift(monthTotal);
    }
    
    return {
        labels: monthLabels,
        data: monthlyData
    };
}

/**
 * Get category breakdown data for charts
 * @param {string} dataType - Type of data ('income' or 'expense')
 * @param {string} period - Period to filter by ('all', 'month', 'year')
 * @returns {Object} - Category data object with labels and values
 */
function getCategoryData(dataType, period = 'all') {
    const data = dataType === 'income' ? getAllIncomes() : getAllExpenses();
    const now = new Date();
    
    // Filter data by period
    let filteredData = data;
    if (period === 'month') {
        filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === now.getMonth() && 
                   itemDate.getFullYear() === now.getFullYear();
        });
    } else if (period === 'year') {
        filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === now.getFullYear();
        });
    }
    
    // Group by category
    const categoryMap = {};
    filteredData.forEach(item => {
        if (!categoryMap[item.category]) {
            categoryMap[item.category] = 0;
        }
        categoryMap[item.category] += item.amount;
    });
    
    // Convert to arrays for chart
    const categories = Object.keys(categoryMap);
    const values = categories.map(category => categoryMap[category]);
    
    return {
        labels: categories,
        data: values
    };
}