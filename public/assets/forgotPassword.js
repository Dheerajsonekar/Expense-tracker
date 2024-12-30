const form = document.querySelector("form");
const email = document.querySelector("#email");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailValue = email.value;
  console.log("submitting email", emailValue);
  try {
    const response = await fetch("api/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("response form api", data);
    }
    window.location.href = "./login.html";
  } catch (err) {
    console.log("failed to get response from api", err);
  }
});
