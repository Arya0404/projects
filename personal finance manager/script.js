const balance = document.getElementById("balance");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const toast = document.getElementById("toast");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function updateUI() {
  transactionList.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(tx => {
    const li = document.createElement("li");
    li.classList.add(tx.type);
    li.innerHTML = `
      ${tx.description}: ₹${tx.amount.toFixed(2)}
      <button class="delete-btn" onclick="deleteTransaction(${tx.id})">&times;</button>
    `;
    transactionList.appendChild(li);

    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  });

  balance.textContent = (income - expense).toFixed(2);
  totalIncome.textContent = income.toFixed(2);
  totalExpense.textContent = expense.toFixed(2);

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!description || isNaN(amount) || amount <= 0) {
    showToast("Please enter valid data.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description,
    amount,
    type
  };

  transactions.push(newTransaction);
  updateUI();
  form.reset();
  showToast("Transaction Added!");
});

function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  updateUI();
  showToast("Transaction Removed!");
}

updateUI();
