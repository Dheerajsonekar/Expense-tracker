const form = document.getElementById('signupForm');

form.addEventListener("submit",  (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response =  fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      
    } catch (error) {
      console.error(error);
    }
  });