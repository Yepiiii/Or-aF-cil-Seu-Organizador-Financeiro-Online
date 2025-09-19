// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const totalReceitasEl = document.getElementById('total-receitas');
const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('list');
const tipsPopup = document.getElementById('tips-popup');
const closePopupButton = document.getElementById('close-popup');

// Array para armazenar as transações em memória
let transactions = [];

// --- FUNÇÕES PRINCIPAIS ---

// Adiciona uma transação à lista na tela (DOM)
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

// Atualiza os valores do resumo geral
function updateSummary() {
    const amounts = transactions.map(t => t.amount);
    const receitas = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const despesas = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);
    const saldo = (receitas - despesas).toFixed(2);

    totalReceitasEl.innerText = `R$ ${receitas}`;
    totalDespesasEl.innerText = `R$ ${despesas}`;
    saldoFinalEl.innerText = `R$ ${saldo}`;
}

// Manipula o envio do formulário para adicionar nova transação
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
    };
    transactions.push(transaction);
    init(); // Atualiza a tela
    descriptionInput.value = '';
    amountInput.value = '';
}

// Remove uma transação pelo ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
}

// Edita uma transação pelo ID (CORRIGIDO)
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const newDescription = prompt('Digite a nova descrição:', transaction.description);
    const newAmountStr = prompt('Digite o novo valor:', transaction.amount);

    // Verifica se o usuário não cancelou os prompts
    if (newDescription === null || newAmountStr === null) {
        alert('Edição cancelada.');
        return;
    }

    const newAmount = parseFloat(newAmountStr);

    // Valida o novo valor
    if (isNaN(newAmount)) {
        alert('Valor inválido. A edição foi cancelada.');
        return;
    }

    // Atualiza os dados da transação no array
    transaction.description = newDescription.trim();
    transaction.amount = newAmount;

    init(); // Atualiza toda a tela com os novos dados
}

// --- INICIALIZAÇÃO ---

// Gera um ID aleatório
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Função de inicialização principal
function init() {
    list.innerHTML = ''; // Limpa a lista antes de recriá-la
    transactions.forEach(addTransactionDOM);
    updateSummary();
}

// --- LÓGICA DO POP-UP DE DICAS ---
window.addEventListener('load', () => {
    // Mostra o pop-up 2 segundos depois que a página carrega
    setTimeout(() => {
        tipsPopup.classList.add('show');
    }, 2000);
});

function closePopup() {
    tipsPopup.classList.remove('show');
}

closePopupButton.addEventListener('click', closePopup);

tipsPopup.addEventListener('click', (e) => {
    // Fecha somente se o clique for no fundo escuro (overlay)
    if (e.target === tipsPopup) {
        closePopup();
    }
});

// --- EVENT LISTENERS GERAIS ---
form.addEventListener('submit', handleFormSubmit);

// Inicia a aplicação pela primeira vez
init();