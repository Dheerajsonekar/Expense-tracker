

const form = document.querySelector("form");
const email = document.querySelector("#email");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailValue = email.value;

  try {
    const response = await axios.post(
      "api/forgotPassword",
      { email: emailValue },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log("response form api", data);
    }
    window.location.href = "./login.html";
  } catch (err) {
    console.log("failed to get response from api", err);
  }
});
