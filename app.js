// Get DOM elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalExpensesEl = document.getElementById("total-expenses");
const filterCategory = document.getElementById("filter-category");
const searchInput = document.getElementById("search");
const expenseChartCtx = document.getElementById("expense-chart").getContext("2d");

// Initialize data
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Update total expenses
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpensesEl.textContent = total.toFixed(2);
}

// Render expenses
function renderExpenses() {
  const query = searchInput.value.toLowerCase();
  const filteredExpenses = filterCategory.value === "All"
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory.value);

  const searchedExpenses = filteredExpenses.filter(expense =>
    expense.description.toLowerCase().includes(query)
  );

  expenseList.innerHTML = "";
  searchedExpenses.forEach((expense, index) => {
    const expenseItem = document.createElement("div");
    expenseItem.textContent = `${expense.description} ($${expense.amount}) - ${expense.category} on ${expense.date}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteExpense(index));

    expenseItem.appendChild(deleteButton);
    expenseList.appendChild(expenseItem);
  });

  updateChart();
}

// Add expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  const expense = { description, amount, category, date };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();
  updateTotal();

  // Clear inputs after adding an expense
  expenseForm.reset();
});

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateTotal();
}

// Update chart
let expenseChart;
function updateChart() {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(expenseChartCtx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Filter by category
filterCategory.addEventListener("change", renderExpenses);

// Search expenses
searchInput.addEventListener("input", renderExpenses);

// Initial render
renderExpenses();
updateTotal();
