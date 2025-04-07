// Database helper for Makaazi Housing Project
class DBHelper {
  constructor() {
    this.db = null;
    this.dbName = 'MakaaziHousingDB';
    this.dbVersion = 1;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create counties store
        if (!db.objectStoreNames.contains('counties')) {
          const countiesStore = db.createObjectStore('counties', { keyPath: 'id' });
          countiesStore.createIndex('name', 'name', { unique: true });
        }

        // Create towns store
        if (!db.objectStoreNames.contains('towns')) {
          const townsStore = db.createObjectStore('towns', { keyPath: 'id' });
          townsStore.createIndex('countyId', 'countyId', { unique: false });
          townsStore.createIndex('name', 'name', { unique: false });
        }

        // Create houses store
        if (!db.objectStoreNames.contains('houses')) {
          const housesStore = db.createObjectStore('houses', { keyPath: 'id' });
          housesStore.createIndex('townId', 'townId', { unique: false });
          housesStore.createIndex('type', 'type', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this);
      };
    });
  }

  // Generic add method
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // Generic get all method
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // Get towns by county
  async getTownsByCounty(countyId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('towns', 'readonly');
      const store = tx.objectStore('towns');
      const index = store.index('countyId');
      const request = index.getAll(countyId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // Get houses by town
  async getHousesByTown(townId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('houses', 'readonly');
      const store = tx.objectStore('houses');
      const index = store.index('townId');
      const request = index.getAll(townId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

const dbHelper = new DBHelper();
export default dbHelper;