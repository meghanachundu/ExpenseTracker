const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalExpenses = document.getElementById("total-expenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // Load expenses from localStorage if available

// Add Expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  // Create expense object
  const expense = { description, amount };
  expenses.push(expense);

  // Save to localStorage
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Update UI
  renderExpenses();
  updateTotal();
  expenseForm.reset();
});

// Render Expenses
function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((expense, index) => {
    const expenseItem = document.createElement("div");
    expenseItem.textContent = `${expense.description}: $${expense.amount}`;
    
    // Create a Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteExpense(index));
    
    // Append Delete Button to Expense Item
    expenseItem.appendChild(deleteButton);
    expenseList.appendChild(expenseItem);
  });
}

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1); // Remove expense from array

  // Save updated expenses to localStorage
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();          // Re-render the list
  updateTotal();             // Update the total
}

// Update Total
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpenses.textContent = total.toFixed(2);
}

// Initial Rendering
renderExpenses();
updateTotal();
