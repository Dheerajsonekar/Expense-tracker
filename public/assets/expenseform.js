const expenseform = document.getElementById("expenseForm");
const expenselist = document.getElementById("list");
const logoutbtn = document.getElementById("logoutbtn");
const username = document.getElementById("username");
const premiumBtn = document.getElementById("premium");
const leaderboardBtn = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardTittle = document.getElementById("leaderboardTittle");
const DownloadExpense = document.getElementById("downloadbtn");
const filesList = document.getElementById("downloadList");
const paginationDiv = document.getElementById("pagination");
const expenseCountSelect = document.getElementById("expenseCountSelect");

const token = localStorage.getItem("authToken");

(async function initializeExpenseform() {
  if (expenseform) {
    const storedExpenseCount = localStorage.getItem("expenseCount") || 10; // Default to 10 if not set
    expenseCountSelect.value = storedExpenseCount;
    // Show expenses with the selected count
    await showExpense(1, storedExpenseCount);

    expenseCountSelect.addEventListener("change", async (e) => {
      const selectedCount = e.target.value;
      localStorage.setItem("expenseCount", selectedCount); // Store in localStorage

      // Refresh the expenses display based on the selected count
      await showExpense(1, selectedCount);
    });

    expenseform.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await axios.post("api/expense", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 201) {
          throw new Error("Failed in axios");
        }

        expenseform.reset();
        console.log(response.data);
        await showExpense(1);
      } catch (err) {
        console.log("Axios failed in post expense", err);
      }
    });

    async function showExpense(page = 1, limit = 10) {
      try {
        const response = await axios.get(
          `api/showexpense?page=${page}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { expenses, totalPages, currentPage } = response.data;

        if (expenselist) {
          expenselist.innerHTML = "";
        }

        expenses.data.forEach((expense) => {
          const newList = document.createElement("li");
          newList.innerHTML = `🔹 💸 <strong>Amount:</strong> ${expense.amount} 
                📝 <strong>Description:</strong> ${expense.description} 
                🗂️ <strong>Category:</strong> ${expense.category} 
                <button class="delete-btn">🗑️ Delete</button>`;
          if (expenselist) {
            expenselist.appendChild(newList);
          }

          const deleteBtn = newList.querySelector(".delete-btn");
          deleteBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const expenseId = expense.id;

            try {
              const result = await axios.delete(`/api/expense/${expenseId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              e.target.parentNode.remove();

              if (result.status === 200) {
                showExpense(currentPage);
                console.log("Deleted successfully!");
              }
            } catch (err) {
              console.log("Failed to delete in script error", err);
            }
          });
        });

        // Render pagination controls

        if (!paginationDiv) {
          const newPaginationDiv = document.createElement("div");
          newPaginationDiv.id = "pagination";
          document.body.appendChild(newPaginationDiv);
        } else {
          paginationDiv.innerHTML = "";
        }

        if (currentPage > 1) {
          const prevButton = document.createElement("button");
          prevButton.textContent = "Previous";
          prevButton.addEventListener("click", () =>
            showExpense(currentPage - 1)
          );
          paginationDiv.appendChild(prevButton);
        }

        const pageInfo = document.createElement("span");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationDiv.appendChild(pageInfo);

        if (currentPage < totalPages) {
          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.addEventListener("click", () =>
            showExpense(currentPage + 1)
          );
          paginationDiv.appendChild(nextButton);
        }
      } catch (err) {
        console.error("Error while showing expenses", err);
      }
    }
  }

  if (logoutbtn) {
    logoutbtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("authToken");
      window.location.href = "./login.html";
      console.log("User logged out.");
    });
  }

  if (username) {
    (async function fetchUserDetails() {
      if (!token) {
        console.log("Token does not exist");
        window.location.href = "./login.html";
      }
      try {
        const user = await axios.get("/api/getuser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        username.textContent = `${user.data.username} (${
          user.data.premium ? "Premium" : "Free"
        })`;
        if (user.data.premium) {
          premiumBtn.style.display = "none";
          leaderboardBtn.style.display = "inline";
          leaderboardBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            leaderboardTittle.style.display = "block";
            try {
              const response = await axios.get("api/premium/leaderboard", {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              console.log("Leaderboard Data:", response.data);

              if (Array.isArray(response.data)) {
                leaderboardList.innerHTML = "";
                response.data.forEach((user, index) => {
                  const newList = document.createElement("li");
                  newList.textContent = `${index + 1}. ${user.username} - ₹${
                    user.totalAmount
                  }`;
                  leaderboardList.appendChild(newList);
                });
              } else {
                console.error(
                  "Leaderboard API returned a non-array response:",
                  response.data
                );
              }
            } catch (err) {
              console.error("Failed to fetch leaderboard data:", err);
            }
          });
        }
      } catch (err) {
        console.log("Failed to get user details", err);
      }
    })();
  }

  premiumBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "api/premium",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response of premium:", response.data);

      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: "INR",
        name: "Premium membership",
        image: "https://yourdomain.com/logo.png",

        description: "Unlock premium features",
        order_id: response.data.orderId,
        handler: async (paymentResponse) => {
          try {
            console.log("Response of verify payment:", paymentResponse);
            await axios.post(
              "api/premium/verify",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            alert("Payment successful. You are now a premium user");
            window.location.reload();
          } catch (err) {
            console.error("Failed to verify payment", err);
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Failed to process premium request", err);
    }
  });

  DownloadExpense.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("/api/download", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("successfully downloaded file. ", response.data);
        await fetchDownloadedFiles();
      }
    } catch (err) {
      console.error("failed to download ", err);
    }
  });

  async function fetchDownloadedFiles() {
    try {
      const response = await axios.get("/api/downloaded-files", {
        headers: { Authorization: `Bearer ${token}` },
      });

      filesList.innerHTML = "";

      response.data.files.forEach((file) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        📄 <strong>${file.fileName}</strong> - 
        📅 Downloaded on: ${new Date(file.downloadedAt).toLocaleString()} 
        <a href="${file.fileUrl}" target="_blank">🔗 Download</a>
      `;
        filesList.appendChild(listItem);
      });
    } catch (err) {
      console.error("Failed to fetch downloaded files:", err);
    }
  }
})();
