const connect = (name, version) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = appDataDBOnUpgradeNeeded;
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      alert("Database is outdated, please reload the page.");
  });
};

const appDataDBOnUpgradeNeeded = function (event) {
  const db = event.target.result;
  switch (event.oldVersion) {
    case 0:
      const state = db.createObjectStore("state", {
        keyPath: "key",
      });
      state.put({ key: "timer", value: { easy: 10, medium: 15, hard: 20 } });
  }
};

const openDatabase = async (name, version, crudFn) => {
  let db;
  try {
    db = await connect(name, version);
    return await crudFn(db);
  } finally {
    if (db) {
      db.close();
    }
  }
};

const getStateValue = (key) =>
  openDatabase("appData", 1, (db) => getStateValueHelper(db, key));

const getStateValueHelper = (db, key) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction("state", "readonly");
    const objectStore = transaction.objectStore("state");
    const request = objectStore.get(key);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      console.error("Transaction Error", event);
      reject(new Error(event));
    };
  });

const setStateValue = (key, value) =>
  openDatabase("appData", 1, (db) => setStateValueHelper(db, key, value));

const setStateValueHelper = (db, key, value) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction("state", "readwrite");
    const objectStore = transaction.objectStore("state");
    const request = objectStore.put({ key, value });
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      console.error("Transaction Error", event);
      reject(new Error(event));
    };
  });
