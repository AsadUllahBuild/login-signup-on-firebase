import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs, Timestamp, orderBy, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

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


let arr = [];

async function getDataFromFirestore() {
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
getDataFromFirestore();

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const postObj = {
            title: title.value,
            description: description.value,
            uid: auth.currentUser.uid, // Corrected 'Uid' to 'uid'
            postDate: Timestamp.fromDate(new Date())
        };
        const docRef = await addDoc(collection(db, "posts"), postObj);
        console.log("Document written with ID: ", docRef.id);
        postObj.docId = docRef.id; // Corrected referencing docRef.id
        arr = [postObj, ...arr];
        console.log(arr);
        renderPost();
        title.value = '';
        description.value = '';
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// Function to render posts
function renderPost() {
    card.innerHTML = '';
    arr.forEach((item) => {
        card.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <p class="card-text"><span class="h4">Title:</span>${item.title}</p>
                    <p><span class="h4">Description:</span> ${item.description}</p>
                    <button type="button" data-id="${item.docId}" class="delete btn btn-danger">Delete</button>
                    <button type="button" data-id="${item.docId}" class="update btn btn-info">Edit</button>
                </div>
            </div>`;
    });

    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const docIdToDelete = button.dataset.id;
            await deleteDoc(doc(db, "posts", docIdToDelete))
                .then(() => {
                    console.log('Post deleted');
                    arr = arr.filter((item) => item.docId !== docIdToDelete);
                    renderPost();
                })
                .catch((error) => {
                    console.error('Error deleting document: ', error);
                });
        });
    });

    //edit function

    const updateButtons = document.querySelectorAll('.update');
    updateButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const updateTitle = prompt('Enter new Title', arr[index].title);
            const updateDescription = prompt('Enter new Description', arr[index].description);

            if (updateTitle !== null && updateTitle !== '' && updateDescription !== null && updateDescription !== '') {
                const docIdToUpdate = arr[index].docId;
                try {
                    await updateDoc(doc(db, "posts", docIdToUpdate), {
                        title: updateTitle,
                        description: updateDescription
                    });
                    arr[index].title = updateTitle;
                    arr[index].description = updateDescription;
                    renderPost();
                } catch (error) {
                    console.error("Error updating document: ", error);
                }
            }
        });
    });
}
