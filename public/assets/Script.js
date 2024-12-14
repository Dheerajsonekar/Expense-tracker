const signupform = document.getElementById("signupForm");
  const loginform = document.getElementById("loginForm");

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
      } catch (error) {
        console.error(error);
      }
    });
  }
