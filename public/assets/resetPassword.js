

const form = document.querySelector("form");
const resetPassword = document.getElementById("resetPassword");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = resetPassword.value;
  const requestId = window.location.pathname.split("/").pop();
  try {
    const response = await axios.post(
      `/api/password/resetPassword/${requestId}`,
      { newPassword: password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      alert("Password has been reset successfully");
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.log("failed to reset password in front end", err);
  }
});
