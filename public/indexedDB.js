let db;

// set up the indexedDB 'budget' database
function createBudgetIDB() {
  if ("indexedDB" in window) {
    const request = indexedDB.open("budget", 1);

    // handles any errors when opening indexedDB database
    request.onerror = function (event) {
      console.log(
        "[Indexed DB] Error with open database request: ",
        request.error
      );
    };

    // indexedDB successfully opened
    // set result to db global variable
    request.onsuccess = function (event) {
      db = request.result;

      if (navigator.onLine) {
        postIndexedTransactions();
      }
    };

    // when upgraded, create 'transactions' store
    request.onupgradeneeded = function (event) {
      const db = request.result;
      db.onerror = function (event) {
        console.log(`[Indexed DB] Error with database: ${db.name}`, db.error);
      };

      db.createObjectStore("transactions", {
        autoIncrement: true,
      });
    };
  } else {
    console.log("IndexedDB is not supported by this browser.");
  }
}

function saveRecord(transactionData) {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  store.add(transactionData);
}

function postIndexedTransactions() {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  const getAll = store.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getAll.result),
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["transactions"], "readwrite");
          const store = transaction.objectStore("transactions");
          store.clear();
        });
    }
  };
}

createBudgetIDB();
window.addEventListener("online", postIndexedTransactions);
