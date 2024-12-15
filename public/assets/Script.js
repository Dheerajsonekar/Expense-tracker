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
      localStorage.setItem("authToken", result.token);

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
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("failed in fetch");
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
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("api/showexpense", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Bearer ${token}`,
        },
      });

      if (expenselist) {
        expenselist.innerHTML = "";
      }
      const expenses = await response.json();

      expenses.forEach((expense) => {
        const newList = document.createElement("li");
        newList.innerHTML = ` 🔹 💸 <strong>Amount:</strong> ${expense.amount} 
                📝 <strong>Description:</strong> ${expense.description} 
                🗂️ <strong>Category:</strong> ${expense.category} 
                 
                <button class="delete-btn">🗑️ Delete</button>`;
        if (expenselist) {
          expenselist.appendChild(newList);
        }
          const deleteBtn = newList.querySelector(".delete-btn");
        if (deleteBtn) {
          
            deleteBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              const expenseId = expense.id;
              const token = localStorage.getItem('authToken');
    
              try {
                const result = await fetch(`/api/expense/${expenseId}`, {
                  method: "DELETE",
                  headers:{
                    'Authorization':`Bearer ${token}`
                  }
                });
                e.target.parentNode.remove();
                const response = await result.json();
                if (response.ok) {
                  showExpense();
                  console.log("deleted successfully!");
                }
              } catch (err) {
                console.log("failed to delete in scripterror", err);
              }
            });
          
          
        }







      });

      const deleteBtn = document.querySelectorAll(".delete-btn");

      
    } catch (err) {
      console.error("error while showing expenses.");
    }
  }
}
