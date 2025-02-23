import { apiFetch } from './apiHelper.js';
const baseUrl = 'http://127.0.0.1:8000/api/';
const serverUrl = 'http://147.93.63.182/api/';
const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
if(!accessToken || accessToken == null || role == 0){
    window.location.href = 'sign-in.html';
}else {
    fetchStatistics();
}

function fetchStatistics() {
    const apiUrl = serverUrl + "statistics";
    apiFetch(apiUrl).then(data => { 
        console.log(data);
        displayStatistics(data);
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}
function displayStatistics(statistics) {
    document.getElementById('usersCount').innerHTML = statistics.usersCount;
    document.getElementById('usersCount2').innerHTML = statistics.usersCount;
    document.getElementById('paritalContainersCount').innerHTML = statistics.paritalContainersCount;
    document.getElementById('paritalContainersCount2').innerHTML = statistics.paritalContainersCount;
    document.getElementById('fullContainersCount').innerHTML = statistics.fullContainersCount;
    document.getElementById('fullContainersCount2').innerHTML = statistics.fullContainersCount;
    document.getElementById('placesCount').innerHTML = statistics.placesCount;
    document.getElementById('placesCount2').innerHTML = statistics.placesCount;

}