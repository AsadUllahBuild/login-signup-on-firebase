import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs, Timestamp, orderBy, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const form = document.querySelector('#form');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const card = document.querySelector("#card");
const username = document.querySelector('#username');
const profileImage = document.querySelector('#profileImage');

//user loin or logout function

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const q = query(collection(db, "users"), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            username.innerHTML = doc.data().name
            profileImage.src = doc.data().profileUrl


        });
    } else {
        window.location = 'index.html'
    }
});

//logout function

const signout = document.querySelector('.logout')
signout.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout successfully');
        window.location = 'index.html'
    }).catch((error) => {
        console.log(error);
    });
})


//get data from firestore


let arr = []

function renderPost() {
    card.innerHTML = ''
    arr.map((item) => {
        card.innerHTML += `
    <div class="card">
    <div class="card-body">
        <p class="card-text"><span class="h4">Title:</span>${item.title}</p>
        <p><span class="h4">Description:</span> ${item.description}</p>
        <button type="button" id="delete" class="btn btn-danger">Delete</button>
        <button type="button" id="update" class="btn btn-info">Edit</button>
    </div>
    
</div>`
    })

    const del = document.querySelectorAll('#delete');
    const update = document.querySelectorAll('#update');
}




async function getDataFormFirestore() {
    arr.length = 0;
    const q = query(collection(db, "posts"), orderBy('postDate', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        arr.push({ ...doc.data(), docId: doc.id });
    });
    console.log(arr);
    renderPost();
}
getDataFormFirestore()

//post data on firestore

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const postObj ={
            title: title.value,
            description: description.value,
            Uid: auth.currentUser.uid,
            postDate: Timestamp.fromDate(new Date())
        }
        const docRef = await addDoc(collection(db, "posts"), postObj );
            
       
        console.log("Document written with ID: ", docRef.id);
        postObj.docId = doc.id;
        arr=[postObj,...arr];
        console.log(arr);
        renderPost();


    } catch (e) {
        console.error("Error adding document: ", e);
    }


})
