// Seleciona os elementos do HTML que vamos manipular
const totalReceitasEl = document.getElementById('total-receitas');
const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('list');

// Array para armazenar todas as transações.
// No futuro, isso poderia ser salvo no LocalStorage para persistir os dados.
let transactions = [];

// Função que adiciona uma nova transação à lista na tela
function addTransactionDOM(transaction) {
    // Determina o sinal (positivo ou negativo)
    const sign = transaction.amount < 0 ? '-' : '+';
    
    // Define a classe CSS (receita ou despesa) para a cor da borda
    const itemClass = transaction.amount < 0 ? 'despesa' : 'receita';
    
    // Cria o elemento da lista (li)
    const item = document.createElement('li');
    
    // Adiciona a classe e o conteúdo HTML ao item
    item.classList.add(itemClass);
    item.innerHTML = `
        ${transaction.description} 
        <span>${sign} R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
    `;
    
    // Adiciona o novo item à lista na tela
    list.appendChild(item);
}

// Função para atualizar os valores do resumo (receitas, despesas, saldo)
function updateSummary() {
    // Pega todos os valores de transação do array
    const amounts = transactions.map(transaction => transaction.amount);
    
    // Calcula o total de receitas (soma de todos os valores positivos)
    const receitas = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
        
    // Calcula o total de despesas (soma de todos os valores negativos)
    const despesas = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);
        
    // Calcula o saldo final
    const saldo = (receitas - despesas).toFixed(2);
    
    // Atualiza os valores no HTML
    totalReceitasEl.innerText = `R$ ${receitas}`;
    totalDespesasEl.innerText = `R$ ${despesas}`;
    saldoFinalEl.innerText = `R$ ${saldo}`;
}

// Função para adicionar uma nova transação
function addTransaction(e) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // Verifica se os campos não estão vazios
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Por favor, preencha a descrição e o valor.');
    } else {
        // Cria o objeto da nova transação
        const transaction = {
            id: generateID(),
            description: descriptionInput.value,
            amount: +amountInput.value // O '+' converte o valor para número
        };
        
        // Adiciona a nova transação ao array de transações
        transactions.push(transaction);
        
        // Adiciona a transação à lista na tela (DOM)
        addTransactionDOM(transaction);
        
        // Atualiza o resumo financeiro
        updateSummary();
        
        // Limpa os campos do formulário
        descriptionInput.value = '';
        amountInput.value = '';
    }
}

// Função para gerar um ID aleatório
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Event Listener: chama a função addTransaction quando o formulário for enviado
form.addEventListener('submit', addTransaction);