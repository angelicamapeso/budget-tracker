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

createBudgetIDB();
