import {
  getIndexedTransactions,
  indexTransaction,
  postIndexedTransactions,
} from "./indexedDB.js";
import { getTransactions, postTransaction } from "./api.js";
import { populateTotal, populateTable, populateChart } from "./populate.js";

let transactions = [];
let myChart;

window.addEventListener("load", function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }

  window.addEventListener("online", postIndexedTransactions);

  getTransactions().then(data => {
    // save db data on global variable
    transactions = data;

    if (!navigator.onLine) {
      getIndexedTransactions().then(transactionData => {
        if (transactionData.length > 0) {
          transactionData.forEach(result => {
            transactions.unshift(result);
          });
        }

        populateTotal(transactions);
        populateTable(transactions);
        populateChart(transactions, myChart);
      });
    } else {
      postIndexedTransactions();
      populateTotal(transactions);
      populateTable(transactions);
      populateChart(transactions, myChart);
    }
  });
});

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString(),
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart(transactions, myChart);
  populateTable(transactions);
  populateTotal(transactions);

  // also send to server
  postTransaction(transaction)
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      // fetch failed, so save in indexed db
      indexTransaction(transaction);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}

document.querySelector("#add-btn").onclick = function () {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  sendTransaction(false);
};
