

const loginform = document.getElementById("loginForm");

if (loginform) {
  loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("/api/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200 ) {
        throw new Error("failed to login.");
      }
      
      loginform.reset();

      
      localStorage.setItem("authToken", response.data.token);

      //After login redirect to expense page
      window.location.href = "./expenseform.html";
    } catch (error) {
      console.error(error);
    }
  });
}
