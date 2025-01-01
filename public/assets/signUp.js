import axios from "axios";

const signupform = document.getElementById("signupForm");

if (signupform) {
  signupform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("/api/signup", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.status !== 201) {
        throw new Error("failed to signUp.");
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
