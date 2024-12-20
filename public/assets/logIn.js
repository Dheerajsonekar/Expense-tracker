const loginform = document.getElementById("loginForm");

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