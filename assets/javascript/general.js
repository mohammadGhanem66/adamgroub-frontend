//import { apiPostOrPut } from './apiHelper.js';

const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');

if(!accessToken || accessToken == null  || role == 0){
    window.location.href = 'sign-in.html';
}else {
    console.log("Access Token is :- "+ accessToken);
    const user = JSON.parse(localStorage.getItem('user'));
    //displayUser(user);
}


function displayUser(user) {
    document.getElementById('userName').innerHTML = user.name;
    document.getElementById('userName2').innerHTML = user.name;
    document.getElementById('userEmail').innerHTML = user.email;
    document.getElementById('userImage').src = user.full_url ? user.full_url : 'img/user.jpg';
    document.getElementById('userImage2').src = user.full_url ? user.full_url : 'img/user.jpg';
}

// const logoutBTN = document.getElementById('logoutBTN');

// logoutBTN.addEventListener('click', async  function() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     localStorage.removeItem('role');
//     const apiUrl = `http://127.0.0.1:8000/api/logout`;
//     const body = {};
//         try {
//             const response = await apiPostOrPut(apiUrl, 'POST', body);
//             window.location.href = 'index.html';
//         } catch (error) {
//             console.error('Error :', error);
//             alert('Saver issue, contact support');
//         }
        
// });