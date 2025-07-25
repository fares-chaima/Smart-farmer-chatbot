// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc-MWkT55x41WYsResKu_1IdBizKu2_ew",
  authDomain: "shesem-dec37.firebaseapp.com",
  databaseURL: "https://shesem-dec37-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shesem-dec37",
  storageBucket: "shesem-dec37.appspot.com", // Fixed typo in storageBucket
  messagingSenderId: "1019296617494",
  appId: "1:1019296617494:web:184fa1d23fa6ef2417d137"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Function to read data from the Realtime Database
async function readFromDatabase(path) {
  const reference = ref(database, path); // Create a reference to the specified path
  const snapshot = await get(reference); // Fetch the data at the specified path

  if (snapshot.exists()) {
    while (snapshot.exists) {
      return snapshot.val();
    } // Return the retrieved data
  } else {
    throw new Error("No data available at the specified path.");
  }
}

// Export the function and database instance for use in other files
export { readFromDatabase, database };