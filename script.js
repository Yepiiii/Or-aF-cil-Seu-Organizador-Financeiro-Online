// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const totalReceitasEl = document.getElementById('total-receitas');
const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('list');
const monthSelect = document.getElementById('month-select');
const reportContent = document.getElementById('report-content');
const tipsPopup = document.getElementById('tips-popup');
const closePopupButton = document.getElementById('close-popup');

// --- LOCALSTORAGE ---
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function saveTransactionsToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// --- FUNÇÕES PRINCIPAIS ---

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'despesa' : 'receita';
    const item = document.createElement('li');
    item.classList.add(itemClass);
    item.innerHTML = `
        <span class="transaction-text">${transaction.description}</span>
        <span>${sign} R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
        <div class="transaction-buttons">
            <button class="edit-btn" onclick="editTransaction(${transaction.id})">✏️</button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">❌</button>
        </div>
    `;
    list.appendChild(item);
}

function updateSummary() {
    const amounts = transactions.map(t => t.amount);
    const receitas = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const despesas = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    const saldo = (receitas - despesas).toFixed(2);

    totalReceitasEl.innerText = `R$ ${receitas}`;
    totalDespesasEl.innerText = `R$ ${despesas}`;
    saldoFinalEl.innerText = `R$ ${saldo}`;
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Por favor, preencha a descrição e o valor.');
        return;
    }
    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: +amountInput.value,
        date: new Date().toISOString()
    };
    transactions.push(transaction);
    saveTransactionsToLocalStorage();
    init();
    descriptionInput.value = '';
    amountInput.value = '';
}

function removeTransaction(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactionsToLocalStorage();
        init();
    }
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    const newDescription = prompt('Digite a nova descrição:', transaction.description);
    const newAmount = prompt('Digite o novo valor:', transaction.amount);

    if (newDescription !== null && newAmount !== null && !isNaN(parseFloat(newAmount))) {
        transaction.description = newDescription.trim() === '' ? transaction.description : newDescription;
        transaction.amount = +newAmount;
        saveTransactionsToLocalStorage();
        init();
    } else if (newDescription !== null || newAmount !== null) {
        alert('Edição cancelada ou valor inválido.');
    }
}

// --- LÓGICA DO RELATÓRIO MENSAL ---

function populateMonthSelect() {
    monthSelect.innerHTML = '<option value="">Relatório Geral</option>';
    const months = new Set();
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthYear = `${date.toLocaleString('pt-BR', { month: 'long' })}/${date.getFullYear()}`;
        months.add(monthYear);
    });

    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.innerText = month.charAt(0).toUpperCase() + month.slice(1);
        monthSelect.appendChild(option);
    });
}

function generateMonthlyReport(selectedMonth) {
    if (!selectedMonth) {
        reportContent.innerHTML = '<p>Selecione um mês para ver o resumo específico.</p>';
        return;
    }
    
    const [monthName, year] = selectedMonth.split('/');
    const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.toLocaleString('pt-BR', { month: 'long' }) === monthName && date.getFullYear() == year;
    });

    const amounts = monthTransactions.map(t => t.amount);
    const receitas = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const despesas = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    const saldo = (receitas - despesas).toFixed(2);

    reportContent.innerHTML = `
        <h4>Resumo de ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}</h4>
        <p>Receitas: <span style="color: #2ecc71;">R$ ${receitas}</span></p>
        <p>Despesas: <span style="color: #e74c3c;">R$ ${despesas}</span></p>
        <p><strong>Saldo do Mês: R$ ${saldo}</strong></p>
    `;
}

// --- INICIALIZAÇÃO ---

function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateSummary();
    populateMonthSelect();
    generateMonthlyReport(monthSelect.value);
}

// --- LÓGICA DO POP-UP DE DICAS ---
window.addEventListener('load', () => {
    // Verifica se o pop-up já foi exibido nesta sessão
    if (!sessionStorage.getItem('tipsShown')) {
        setTimeout(() => {
            tipsPopup.classList.add('show');
            sessionStorage.setItem('tipsShown', 'true'); // Marca que foi exibido
        }, 2000);
    }
});

closePopupButton.addEventListener('click', () => {
    tipsPopup.classList.remove('show');
});

tipsPopup.addEventListener('click', (e) => {
    if (e.target === tipsPopup) {
        tipsPopup.classList.remove('show');
    }
});

// --- EVENT LISTENERS GERAIS ---
form.addEventListener('submit', handleFormSubmit);
monthSelect.addEventListener('change', (e) => generateMonthlyReport(e.target.value));

// Inicia a aplicação
init();