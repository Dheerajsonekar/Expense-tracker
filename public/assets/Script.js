const signupform = document.getElementById("signupForm");
const loginform = document.getElementById("loginForm");
const expenseform = document.getElementById("expenseForm");
const expenselist = document.getElementById("list");
const logoutbtn = document.getElementById("logoutbtn");
const username = document.getElementById("username");
const premiumBtn = document.getElementById("premium");
const leaderboardBtn = document.getElementById("leaderboard")

// sign up section

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

//  login section

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

// expense section
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

  // show expense section
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

      // expense list
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

        // delete btn functionality
        const deleteBtn = newList.querySelector(".delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const expenseId = expense.id;
            const token = localStorage.getItem("authToken");

            try {
              const result = await fetch(`/api/expense/${expenseId}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
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
    } catch (err) {
      console.error("error while showing expenses.");
    }
  }
}

// logout btn section
if (logoutbtn) {
  logoutbtn.addEventListener("click", async (e) => {
    e.preventDefault();

    localStorage.removeItem("authToken");

    window.location.href = "./login.html";

    console.log("User logged out.");
  });
}

// display username section

if (username) {
  (async function fetchUserDetails() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("token does not exit");

      window.location.href = "./login.html";
    }
    try {
      const response = await fetch("/api/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await response.json();

      username.textContent = `${user.username} (${
        user.premium ? "Premium" : "Free"
      })`;
      if (user.premium) {
        if (premiumBtn) {
          premiumBtn.style.display = "none";
        }
      }
    } catch (err) {
      console.log("failed to get name in script", err);
    }
  })();
}

// premium user section

if (premiumBtn) {
  premiumBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    const response = await fetch("api/premium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { orderId, key } = await response.json();

    const options = {
      key: key,
      amount: 100,
      currency: "INR",
      name: "Premium membership",
      description: "unlock premium features",
      order_id: orderId,
      handler: async (response) => {
        await fetch("api/premium/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        });
        alert("Payment successful. You are now a premium user");

        window.location.reload();
      },

      theme: "#3399cc",
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  });
}

if(leaderboardBtn){
  leaderboardBtn.addEventListener("click", async (e)=>{
    e.preventDefault();

    try{
      
      const response = await fetch('api/board', {
        method: "GET"
      })

      const result = await response.json();

      result.forEach((exp)=>{
         
      })

    }catch(err){

    }

  })
}