const expenseform = document.getElementById("expenseForm");

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
  //show form on click on plus
  const addNotesButton = document.getElementById("notesbtn");
  const addExpenseButton = document.getElementById("addExpenseButton");
  const notesFormOverlay = document.getElementById("notesFormOverlay");
  const expenseFormOverlay = document.getElementById("expenseFormOverlay");
  const closeExpenseForm = document.getElementById("closeExpenseForm");
  const closeNotesForm = document.getElementById("closeNotesForm");

  addExpenseButton.addEventListener("click", () => {
    notesFormOverlay.classList.add("hidden");
    expenseFormOverlay.classList.remove("hidden");
  });

  addNotesButton.addEventListener("click", () => {
    expenseFormOverlay.classList.add("hidden");
    notesFormOverlay.classList.remove("hidden");
  });

  closeExpenseForm.addEventListener("click", () => {
    expenseFormOverlay.classList.add("hidden");
  });

  closeNotesForm.addEventListener("click", () => {
    notesFormOverlay.classList.add("hidden");
  });

  notesFormOverlay.addEventListener("click", (e) => {
    if (e.target === notesFormOverlay) {
      notesFormOverlay.classList.add("hidden");
    }
  });

  expenseFormOverlay.addEventListener("click", (e) => {
    if (e.target === expenseFormOverlay) {
      expenseFormOverlay.classList.add("hidden");
    }
  });

  // show expense and floating button and floating download pdf according to click on daily , monthly, yearly

  const expenselist = document.getElementById("list");
  const notesButton = document.getElementById("notes");
  const dailyButton = document.getElementById("daily");
  const monthlyButton = document.getElementById("monthly");
  const yearlyButton = document.getElementById("yearly");
  const showDailyExpensediv = document.getElementById("showDailyExpensediv");
  const showNotesdiv = document.getElementById("showNotesdiv");
  const showMonthlyExpensesdiv = document.getElementById(
    "showMonthlyExpensesdiv"
  );
  const showYearlyExpensesdiv = document.getElementById(
    "showYearlyExpensesdiv"
  );

  DownloadExpense.classList.add("hidden");
  addNotesButton.classList.add("hidden");
  showNotesdiv.classList.add("hidden");
  showMonthlyExpensesdiv.classList.add("hidden");
  showYearlyExpensesdiv.classList.add("hidden");

  // show current date with year in daily expense
  const dateForExpense = document.getElementById("dateForExpense");

  const currentDate = new Date();
  function formatDate(date) {
    return date.toLocaleDateString("en-Us", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  function updateDisplay() {
    dateForExpense.textContent = formatDate(currentDate);
  }
  document.getElementById("prevBtn").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDisplay();
    showExpense(1, 5);
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDisplay();
    showExpense(1, 5);
  });

  updateDisplay();

  // initially showExpense section
  const storedExpenseCount = localStorage.getItem("expenseCount") || 10;
  expenseCountSelect.value = storedExpenseCount;

  await showExpense(1, storedExpenseCount);

  expenseCountSelect.addEventListener("change", async (e) => {
    const selectedCount = e.target.value;
    localStorage.setItem("expenseCount", selectedCount);

    await showExpense(1, selectedCount);
  });

  if (expenseform) {
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
        await showExpense(1, 10);
        await fetchUserDetails();
      } catch (err) {
        console.log("Axios failed in post expense", err);
      }
    });

    // relation between type of expenses and select category

    const selectedExpenseType = document.getElementById("expenseType");
    const selectedCategory = document.getElementById("category");

    const options = {
      Credit: [
        { value: "salary", text: "salary" },
        { value: "investment", text: "investment income" },
        { value: "bussiness", text: "bussiness income" },
        { value: "other", text: "other" },
      ],
      Debit: [
        { value: "food", text: "food" },
        { value: "pooja", text: "pooja" },
        { value: "movie", text: "movie" },
        { value: "coding", text: "coding" },
        { value: "book", text: "book" },
        { value: "date", text: "date" },
        { value: "sport", text: "sport" },
        { value: "other", text: "other" },
      ],
    };

    selectedExpenseType.addEventListener("change", () => {
      const selectedType = selectedExpenseType.value;

      selectedCategory.innerHTML =
        '<option value="" disabled selected>Select category</option>';

      if (selectedType && options[selectedType]) {
        selectedCategory.disabled = false;

        options[selectedType].forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option.value;
          opt.text = option.text;
          selectedCategory.appendChild(opt);
        });
      } else {
        selectedCategory.disabled = true;
      }
    });
  }

  notesButton.addEventListener("click", async () => {
    const noteCountSelect = document.getElementById("noteCountSelect");
    const dateForNotes = document.getElementById("dateForNotes");

    // show current date with year in Notes section

    const currentDate = new Date();
    function formatDate(date) {
      return date.toLocaleDateString("en-Us", {
        month: "long",
        year: "numeric",
      });
    }
    function updateDisplay() {
      dateForNotes.textContent = formatDate(currentDate);
    }
    document.getElementById("prevBtnForNotes").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateDisplay();
      showNotes(1, 5);
    });
    document.getElementById("nextBtnForNotes").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateDisplay();
      showNotes(1, 5);
    });

    updateDisplay();

    const storedNotesCount = localStorage.getItem("notesCount") || 10;
    noteCountSelect.value = storedNotesCount;

    // Show expenses with the selected count
    await showNotes(1, storedNotesCount);

    noteCountSelect.addEventListener("change", async (e) => {
      const selectedCount = e.target.value;
      localStorage.setItem("notesCount", selectedCount); // Store in localStorage

      // Refresh the expenses display based on the selected count
      await showNotes(1, selectedCount);
    });

    showNotesdiv.classList.remove("hidden");
    showDailyExpensediv.classList.add("hidden");
    addExpenseButton.classList.add("hidden");
    addNotesButton.classList.remove("hidden");
    showYearlyExpensesdiv.classList.add("hidden");

    const addNotesForm = document.getElementById("notesForm");

    if (addNotesForm) {
      addNotesForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
          const response = await axios.post("/api/notes", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status !== 201) {
            throw new Error("Failed in axios");
          } else {
            addNotesForm.reset();
            console.log(response.data);
            await showNotes(1, noteCountSelect.value || 10);
          }
        } catch (err) {
          console.log("Axios failed in post notes", err);
        }
      });
    }

    async function showNotes(page = 1, limit = 10) {
      try {
        const response = await axios.get(
          `api/shownotes?page=${page}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        const { note, totalPages, currentPage } = response.data;

        notesList = document.getElementById("notelist");

        notesList.innerHTML = "";

        note.forEach((n) => {
          const newList = document.createElement("li");
          const createdAt = `${n.createdAt}`;
          const date = new Date(createdAt);
          const formatedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const day = date.toLocaleDateString("en-US", { weekday: "long" });

          if (formatDate(date) === formatDate(currentDate)) {
            newList.innerHTML = `🔹 <div><strong>${formatedDate}.${day}</strong> <br>
              📝 <strong>Description:</strong> ${n.note} 
               
              <button class="delete-btn">🗑️ Delete</button></div><hr>`;
            if (notesList) {
              notesList.appendChild(newList);
            }
            const deleteBtn = newList.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              const noteId = n.id;
              console.log("noteId: ", noteId);

              try {
                const result = await axios.delete(`/api/note/${noteId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                e.target.parentNode.remove();

                if (result.status === 200) {
                  await showNotes(currentPage, limit);
                  console.log("Deleted successfully!");
                }
              } catch (err) {
                console.log("Failed to delete in script error", err);
              }
            });
          }
        });

        // Render pagination controls
        const paginationDiv = document.getElementById("paginationForNotes");

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
            showNotes(currentPage - 1, limit)
          );
          paginationDiv.appendChild(prevButton);
        }

        const pageInfo = document.createElement("span");
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
        paginationDiv.appendChild(pageInfo);

        if (currentPage < totalPages) {
          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.addEventListener("click", () =>
            showNotes(currentPage + 1, limit)
          );
          paginationDiv.appendChild(nextButton);
        }
      } catch (err) {
        console.error("Error while showing notes", err);
      }
    }
  });

  dailyButton.addEventListener("click", async () => {
    showYearlyExpensesdiv.classList.add("hidden");
    showNotesdiv.classList.add("hidden");
    showDailyExpensediv.classList.remove("hidden");
    addExpenseButton.classList.remove("hidden");
    DownloadExpense.classList.add("hidden");
    addNotesButton.classList.add("hidden");
  });

  monthlyButton.addEventListener("click", () => {
    showYearlyExpensesdiv.classList.add("hidden");
    showMonthlyExpensesdiv.classList.remove("hidden");
    showNotesdiv.classList.add("hidden");
    showDailyExpensediv.classList.add("hidden");
    DownloadExpense.classList.remove("hidden");
    addExpenseButton.classList.add("hidden");
    addNotesButton.classList.add("hidden");
    showMonthlyExpenses(1, 5);
    // Date showing in header of monthly expenses
    const dateforMonthlyExpenses = document.getElementById(
      "dateForMonthlyExpenses"
    );
    const currentDate = new Date();
    function formatDate(date) {
      return date.toLocaleDateString("en-Us", {
        month: "long",
        year: "numeric",
      });
    }
    function updateDisplay() {
      dateforMonthlyExpenses.textContent = formatDate(currentDate);
    }
    document.getElementById("prevBtnForMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateDisplay();
      showMonthlyExpenses(1, 5);
    });
    document.getElementById("nextBtnForMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateDisplay();
      showMonthlyExpenses(1, 5);
    });

    updateDisplay();

    // show monthly expenses

    async function showMonthlyExpenses(page = 1, limit = 5) {
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
        const expenseListForMonthly = document.getElementById(
          "expenseListOfMonths"
        );

        if (expenseListForMonthly) {
          expenseListForMonthly.innerHTML = "";
        }

        const groupByMonth = {};

        expenses.forEach((expense) => {
          const date = new Date(expense.createdAt);

          const month = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
          if (month === formatDate(currentDate)) {
            if (!groupByMonth[month]) {
              groupByMonth[month] = {
                expenses: [],
                totalCredit: 0,
                totalDebit: 0,
              };
            }
            groupByMonth[month].expenses.push(expense);

            if (expense.expenseType === "Credit") {
              groupByMonth[month].totalCredit += expense.amount;
            } else {
              groupByMonth[month].totalDebit += expense.amount;
            }
          }
        });

        //render grouped expenses by month

        for (const month in groupByMonth) {
          const monthData = groupByMonth[month];
          const totalDiv = document.createElement("div");
          totalDiv.innerHTML = `<div>Total Credit: 💸${
            monthData.totalCredit
          } Rs | Total Debit: 💸${monthData.totalDebit} Rs Balance: ${
            monthData.totalCredit - monthData.totalDebit
          } </div>`;
          expenseListForMonthly.appendChild(totalDiv);
          monthData.expenses.forEach((expense) => {
            const headerMonth = document.createElement("p");
            const date = new Date(expense.createdAt);
            const headerDate = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            });
            const expenseDay = new Intl.DateTimeFormat("en-Us", {
              weekday: "long",
            }).format(date);
            headerMonth.textContent = `${expenseDay}.${headerDate}`;
            expenseListForMonthly.appendChild(headerMonth);
            const amountColor =
              expense.expenseType === "Debit" ? "red" : "green";

            const newList = document.createElement("li");
            if (expense.expenseType === "Credit") {
              newList.innerHTML = `

              <div>
              <div>
                credited
                🗂️ ${expense.category} <span style="color:${amountColor};">💸${expense.amount} Rs</span>
                📝 ${expense.description}
                
              </div>  
              
              <strong><p>total balance: </p></strong> 
              </div> 
            `;
            } else {
              newList.innerHTML = `

              <div>
                
              <div>
                debited
                🗂️ ${expense.category} <span style="color:${amountColor};">💸${expense.amount} Rs</span>
                📝 ${expense.description}
                
              </div> 
              <strong><p>total balance: </p></strong> 
              </div> 
            `;
            }

            expenseListForMonthly.appendChild(newList);
          });
        }

        // Render pagination controls

        const paginationDiv = document.getElementById(
          "paginationForMonthlyExpenses"
        );
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
            showMonthlyExpenses(currentPage - 1, limit)
          );
          paginationDiv.appendChild(prevButton);
        }

        const pageInfo = document.createElement("span");
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
        paginationDiv.appendChild(pageInfo);

        if (currentPage < totalPages) {
          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.addEventListener("click", () =>
            showMonthlyExpenses(currentPage + 1, limit)
          );
          paginationDiv.appendChild(nextButton);
        }
      } catch (err) {
        console.error("Error while showing monthly expenses", err);
      }
    }
  });

  yearlyButton.addEventListener("click", () => {
    showYearlyExpensesdiv.classList.remove("hidden");
    showMonthlyExpensesdiv.classList.add("hidden");
    showNotesdiv.classList.add("hidden");
    showDailyExpensediv.classList.add("hidden");
    DownloadExpense.classList.remove("hidden");
    addExpenseButton.classList.add("hidden");
    addNotesButton.classList.add("hidden");

    showYearlyExpenses();
    // year showing in the header of yearly expenses
    const dateforyearlyExpenses = document.getElementById(
      "dateForYearlyExpenses"
    );
    const currentDate = new Date();
    function formatDate(date) {
      return date.toLocaleDateString("en-Us", {
        year: "numeric",
      });
    }
    function updateDisplay() {
      dateforyearlyExpenses.textContent = formatDate(currentDate);
    }
    document
      .getElementById("prevBtnForYearlyExpenses")
      .addEventListener("click", () => {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        updateDisplay();
        showYearlyExpenses(1, 5);
      });
    document
      .getElementById("nextBtnForYearlyExpenses")
      .addEventListener("click", () => {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        updateDisplay();
        showYearlyExpenses(1, 5);
      });

    updateDisplay();

    async function showYearlyExpenses(year, page = 1, limit = 5) {
      try {
        const expenseListForYearly = document.getElementById(
          "expenseListForYearly"
        );

        if (!expenseListForYearly) {
          
          console.error(
            "Error: Element 'expenseListOfYearly' not found in the DOM."
          );
          return;
        }

        expenseListForYearly.innerHTML = ""; // Clear previous data

        const response = await axios.get(
          `api/showexpense?year=${year}&page=${page}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { expenses, totalPages, currentPage } = response.data;
        const groupByMonth = {};

        expenses.forEach((expense) => {
          const date = new Date(expense.createdAt);
          const month = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });

          if (!groupByMonth[month]) {
            groupByMonth[month] = {
              expenses: [],
              totalCredit: 0,
              totalDebit: 0,
            };
          }

          groupByMonth[month].expenses.push(expense);

          if (expense.expenseType === "Credit") {
            groupByMonth[month].totalCredit += expense.amount;
          } else {
            groupByMonth[month].totalDebit += expense.amount;
          }
        });

        for (const month in groupByMonth) {
          const monthData = groupByMonth[month];
          const monthDiv = document.createElement("div");
          monthDiv.innerHTML = `<h2>${month}</h2> 
                                    <p><strong>Total Credit:</strong> 💸${
                                      monthData.totalCredit
                                    } Rs</p>
                                    <p><strong>Total Debit:</strong> 💸${
                                      monthData.totalDebit
                                    } Rs</p>
                                    <p><strong>Balance:</strong> 💸${
                                      monthData.totalCredit -
                                      monthData.totalDebit
                                    } Rs</p>
                                    <hr>`;

          expenseListForYearly.appendChild(monthDiv);

          
        }
      } catch (err) {
        console.error("Error while showing yearly expenses", err);
      }
    }
  });

  await fetchDownloadedFiles();

  if (logoutbtn) {
    logoutbtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("authToken");
      window.location.href = "./login.html";
      console.log("User logged out.");
    });
  }

  async function fetchUserDetails() {
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
      document.getElementById(
        "balance"
      ).textContent = `Balance = ${user.data.totalAmount}`;
      if (user.data.premium) {
        premiumBtn.style.display = "none";

        leaderboardBtn.addEventListener("click", async (e) => {
          e.preventDefault();

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
  }
  fetchUserDetails();

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

  // function to show Expenses
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

      expenses.forEach((expense) => {
        const createdDate = expense.createdAt;
        const date = new Date(`${createdDate}`);
        const expenseDate = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const expenseDay = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(date);

        const amountColor = expense.expenseType === "Debit" ? "red" : "green";
        const headerDate = formatDate(currentDate);

        if (expenseDate === headerDate) {
          const newList = document.createElement("li");
          newList.innerHTML = `<div><p></p>
          <p><strong>${expense.expenseType}ed</strong></p>
          <p>🗂️ ${expense.category} <span style="color:${amountColor};">💸${expense.amount} Rs</span> </p> 
           📝 ${expense.description}
           
              
              <button class="delete-btn">🗑️ Delete</button></div>  `;

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
                await showExpense(currentPage, limit);
                console.log("Deleted successfully!");
              }
            } catch (err) {
              console.log("Failed to delete in script error", err);
            }
          });
        }
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
          showExpense(currentPage - 1, limit)
        );
        paginationDiv.appendChild(prevButton);
      }

      const pageInfo = document.createElement("span");
      pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
      paginationDiv.appendChild(pageInfo);

      if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", () =>
          showExpense(currentPage + 1, limit)
        );
        paginationDiv.appendChild(nextButton);
      }
    } catch (err) {
      console.error("Error while showing expenses", err);
    }
  }
})();
