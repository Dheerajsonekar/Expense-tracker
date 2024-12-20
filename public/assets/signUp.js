const signupform = document.getElementById("signupForm");

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
  