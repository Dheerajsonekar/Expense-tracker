const signupform = document.getElementById("signupForm");
const loginform = document.getElementById("loginForm");
const expenseform = document.getElementById("expenseForm");
const expenselist = document.getElementById("list");

if (signupform) {
  signupform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("failed to fetch.");
      }
      signupform.reset();
      const result = await response.json();
      console.log(result);

      //redirect to login page after successfull signup
      window.location.href = "./login.html";
    } catch (error) {
      console.error(error);
    }
  });
}

if (loginform) {
  loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("failed to fetch.");
      }
      loginform.reset();

      const result = await response.json();

      console.log(result);

      //After login redirect to expense page
      window.location.href = "./expenseform.html";
    } catch (error) {
      console.error(error);
    }
  });
}

if (expenseform) {
  showExpense();
  expenseform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if(!response.ok){
        throw new Error('failed in fetch')
      }

      expenseform.reset();
      
      const result = await response.json();
      console.log(result);

     await showExpense();
    } catch (err) {
      console.log(" fetch failed in post expense", err);
    }
  });

  
  async function showExpense() {
    try {
      const response = await fetch("api/showexpense", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const expenses = await response.json();

      expenses.forEach((expense) => {
        const newList = document.createElement("li");
        newList.innerHTML = `${expense.amount} ${expense.description} ${expense.category}<button id="edit-btn">Edit</button> <button id="delete-btn">Delete</button>`;
        if (expenselist) {
          expenselist.appendChild(newList);
        }
      });
    } catch (err) {
      console.error("error while showing expenses.");
    }
  }
  

}
