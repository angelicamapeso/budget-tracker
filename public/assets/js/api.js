export function getTransactions() {
  return fetch("/api/transaction").then(response => {
    return response.json();
  });
}

export function postTransaction(transaction) {
  return fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
}
