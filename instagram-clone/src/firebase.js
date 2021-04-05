import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyANWKTm5znamWNEnODShvP7FCuKcGuWznY",
        authDomain: "instagram-clone-9441a.firebaseapp.com",
        projectId: "instagram-clone-9441a",
        storageBucket: "instagram-clone-9441a.appspot.com",
        messagingSenderId: "55325392854",
        appId: "1:55325392854:web:a849df42d2c554a5ff6e77",
        measurementId: "G-Z86WB410D3"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();         //it check the authentication when we get login
const storage = firebase.storage();     // it stores the photos what we login

export { db , auth , storage };

//npm i firebase