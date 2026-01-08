// Initialize data
let balance = 5000;
let incomes = [];
let expenses = [];

// Load data from localStorage
function loadData() {
    const savedBalance = localStorage.getItem('balance');
    const savedIncomes = localStorage.getItem('incomes');
    const savedExpenses = localStorage.getItem('expenses');

    if (savedBalance) {
        balance = parseFloat(savedBalance);
    }

    if (savedIncomes) {
        incomes = JSON.parse(savedIncomes);
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }

    updateDisplay();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update balance display
function updateBalance() {
    const balanceElement = document.getElementById('current-balance');
    balanceElement.textContent = `₵${balance.toFixed(2)}`;
}

// Update total income display
function updateTotalIncome() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalElement = document.getElementById('total-income');
    totalElement.textContent = `₵${totalIncome.toFixed(2)}`;
}

// Update total expenses display
function updateTotalExpenses() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalElement = document.getElementById('total-expenses');
    totalElement.textContent = `₵${totalExpenses.toFixed(2)}`;
}

// Render incomes list
function renderIncomes() {
    const list = document.getElementById('incomes-list');
    list.innerHTML = '';

    incomes.forEach((income, index) => {
        const li = document.createElement('li');
        li.className = 'income-item';
        li.innerHTML = `
            <span class="income-desc">${income.description}</span>
            <span class="income-amount">₵${income.amount.toFixed(2)}</span>
            <span class="income-date">${income.date}</span>
        `;
        list.appendChild(li);
    });
}

// Render expenses list
function renderExpenses() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = '';

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <span class="expense-desc">${expense.description}</span>
            <span class="expense-amount">₵${expense.amount.toFixed(2)}</span>
            <span class="expense-date">${expense.date}</span>
        `;
        list.appendChild(li);
    });
}

// Update all displays
function updateDisplay() {
    updateBalance();
    updateTotalIncome();
    updateTotalExpenses();
    renderIncomes();
    renderExpenses();
}

// Open modal
function openModal() {
    const modal = document.getElementById('modal');
    const dateInput = document.getElementById('date');
    dateInput.value = new Date().toISOString().split('T')[0]; // Set to today
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.getElementById('expense-form').reset();
}

// Open income modal
function openIncomeModal() {
    const modal = document.getElementById('income-modal');
    const dateInput = document.getElementById('income-date');
    dateInput.value = new Date().toISOString().split('T')[0]; // Set to today
    modal.style.display = 'block';
}

// Close income modal
function closeIncomeModal() {
    const modal = document.getElementById('income-modal');
    modal.style.display = 'none';
    document.getElementById('income-form').reset();
}

// Add income
function addIncome(event) {
    event.preventDefault();

    const description = document.getElementById('income-description').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value);
    const date = document.getElementById('income-date').value || new Date().toISOString().split('T')[0];

    if (!description || amount <= 0) {
        alert('Please enter a valid description and amount greater than 0.');
        return;
    }

    const income = { description, amount, date };
    incomes.push(income);
    balance += amount;

    saveData();
    updateDisplay();
    closeIncomeModal();
}

// Add expense
function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];

    if (!description || amount <= 0) {
        alert('Please enter a valid description and amount greater than 0.');
        return;
    }

    if (amount > balance) {
        alert('Amount exceeds current balance.');
        return;
    }

    const expense = { description, amount, date };
    expenses.push(expense);
    balance -= amount;

    saveData();
    updateDisplay();
    closeModal();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const addIncomeBtn = document.getElementById('add-income-btn');
    const closeIncomeBtn = document.querySelector('.close-income');
    const incomeForm = document.getElementById('income-form');

    const addBtn = document.getElementById('add-expense-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('expense-form');

    addIncomeBtn.addEventListener('click', openIncomeModal);
    closeIncomeBtn.addEventListener('click', closeIncomeModal);

    addBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
        const incomeModal = document.getElementById('income-modal');
        if (event.target === incomeModal) {
            closeIncomeModal();
        }
    });

    incomeForm.addEventListener('submit', addIncome);
    form.addEventListener('submit', addExpense);
});
