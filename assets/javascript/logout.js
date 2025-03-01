import { apiPostOrPut } from './apiHelper.js';

const baseUrl = 'http://127.0.0.1:8000/api/';
const serverUrl = 'http://147.93.63.182/api/';
const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
if(!accessToken || accessToken == null || role == 0){
    window.location.href = 'sign-in.html';
}

const logoutBTN = document.getElementById('logoutBTN');
    logoutBTN.addEventListener('click', async  function() {
        console.log("Logout Clicked");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        const apiUrl = serverUrl + `logout`;
        const body = {};
            try {
                const response = await apiPostOrPut(apiUrl, 'POST', body);
                window.location.href = 'sign-in.html';
            } catch (error) {
                console.error('Error :', error);
                alert('Saver issue, contact support');
            }
        
    });