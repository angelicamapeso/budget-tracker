// set up the indexedDB 'budget' database
function getBudgetIDBConnection() {
  return new Promise((resolve, reject) => {
    let db;
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
        resolve(db);
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
      resolve(db);
    }
  });
}

function indexTransaction(transactionData) {
  return new Promise((resolve, reject) => {
    getBudgetIDBConnection().then(db => {
      if (db) {
        const transaction = db.transaction(["transactions"], "readwrite");
        const store = transaction.objectStore("transactions");
        store.add(transactionData);
        resolve(transactionData);
      } else {
        resolve(db);
      }
    });
  });
}

function getIndexedTransactions() {
  return new Promise((resolve, reject) => {
    getBudgetIDBConnection().then(db => {
      if (db) {
        const transaction = db.transaction(["transactions"], "readonly");
        const store = transaction.objectStore("transactions");
        const getAll = store.getAll();
        getAll.onsuccess = function () {
          resolve(getAll.result);
        };
      } else {
        resolve(db);
      }
    });
  });
}

function postIndexedTransactions() {
  getIndexedTransactions().then(transactions => {
    if (transactions.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactions),
      })
        .then(response => response.json())
        .then(() => {
          getBudgetIDBConnection().then(db => {
            if (db) {
              const transaction = db.transaction(["transactions"], "readwrite");
              const store = transaction.objectStore("transactions");
              store.clear();
            }
          });
        });
    }
  });
}

window.addEventListener("online", postIndexedTransactions);
