import { apiFetch, apiPostOrPut } from './apiHelper.js';
const baseUrl = 'http://127.0.0.1:8000/api/';
const serverUrl = 'http://147.93.63.182/api/';
const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
if(!accessToken || accessToken == null || role == 0){
    window.location.href = 'sign-in.html';
}else {
    fetchPlaces();
}
function fetchPlaces() {
    const apiUrl = serverUrl + 'places';
        apiFetch(apiUrl).then(data => { 
            console.log(data.places);
            displayPlaces(data.places);
        }).catch(error => {
            console.error('Error fetching users:', error);
        });
}
function displayPlaces(places) {
    const placesTableBody = document.getElementById('placesTableBody');
    places.forEach(place => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="${place.public_url}" class="avatar avatar-sm me-3 " alt="user1">
                          </div>
                          <div class="d-flex flex-column justify-content-center" style="padding-right:0.25rem">
                            <h6 class="mb-0 text-sm"> ${place.name}</h6>
                            <p class="text-xs text-secondary mb-0"></p>
                          </div>
                        </div>
                      </td>
             <td>
                <p class="text-xs font-weight-bold mb-0">${place.country}</p>
                <p class="text-xs text-secondary mb-0">${place.city}</p>
             </td>
            <td class="align-middle text-center"><p class="text-xs font-weight-bold mb-0">${place.description}</p></td>
             <td class="align-middle text-center">
               <a href="javascript:;" class="text-secondary font-weight-bold text-xs dropdown-toggle">
                    <i class="fa fa-ellipsis-v"></i>
                </a>
                <div class="dropdown-content">
                    <a href="javascript:deletePlace(this, ${place.id});">❌ حذف</a>
                </div>
        `;
        const dropdownToggle = row.querySelector('.dropdown-toggle');
        const dropdownContent = row.querySelector('.dropdown-content');

        // Event listener for the dropdown toggle (3 dots icon)
        dropdownToggle.addEventListener('click', function (e) {
            e.stopPropagation();  // Prevent the click from bubbling up to the table

            // Toggle visibility of the dropdown content
            const isVisible = dropdownContent.classList.contains('show');
            if (isVisible) {
            dropdownContent.classList.remove('show');
            } else {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-content').forEach(content => content.classList.remove('show'));
            dropdownContent.classList.add('show');
            }
        });
        placesTableBody.appendChild(row);
    });
}
const closeModal = document.querySelector('.closeModal');
closeModal.addEventListener('click', function () {
    const restPasswordModal = new bootstrap.Modal(document.getElementById('restPasswordModal'));
    restPasswordModal.hide();
});

// Close dropdown if clicking outside of the table row
document.addEventListener('click', function (e) {
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
});

const createPlaceBTN = document.getElementById('createPlaceBTN');
createPlaceBTN.addEventListener('click', async  function() {
    const placeName = document.getElementById('placeName').value;
    const placeCity = document.getElementById('placeCity').value;
    const placeCountry = document.getElementById('placeCountry').value;
    const fileNamePreview = document.getElementById('fileNamePreview').value;
    const fileInput = document.getElementById('attachFileInput');
    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
        Swal.fire('الرجاء اختيار صورة');
        return;
    }
    var apiUrl = serverUrl + 'places';
    const formData = new FormData();
    formData.append('image_path', selectedFile);
    formData.append('image_name', fileNamePreview);
    formData.append('name', placeName);
    formData.append('city', placeCity);
    formData.append('country', placeCountry);
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Use POST with `_method` for Laravel compatibility
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
              },
        });
        const result = await response.json();
        console.log(result);
        if (response.ok) {
            Swal.fire("تم انشاء المكان بنجاح", "تم انشاء المكان بنجاح", "success");
            document.getElementById('placeName').value = '';
            document.getElementById('placeCity').value = '';
            document.getElementById('placeCountry').value = '';
            document.getElementById('fileNamePreview').value = '';
            document.getElementById('filePreview').innerHTML = '';
            const createPlaceModal = new bootstrap.Modal(document.getElementById('createPlaceModal'));
            createPlaceModal.hide();
            window.location.reload();
         }
    } catch (error) {
        console.error('Error:', error);
    }
});
window.deletePlace = async function (element,placeId) {
    console.log("Deleting place ID:", placeId);
    Swal.fire({
        title: "هل انت متاكد من حذف المكان ؟!",
        showDenyButton: true,
         confirmButtonText: "أحذف !",
        denyButtonText: `لا تحذف !`
      }).then(async (result) => {
        if (result.isConfirmed) {
            const apiUrl = serverUrl + `places/${placeId}`;
            try {
                const response = await apiPostOrPut(apiUrl, 'DELETE', {});
                console.log(response);
            } catch (error) {
                console.error('Error :', error);
                alert('Saver issue, contact support');
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "تم حذف المكان بنجاح",
                showConfirmButton: false,
                timer: 1500
              });
              window.location.reload();
        } else if (result.isDenied) {
          Swal.fire("لم يتم حذف المكان", "", "info");
        }
      });
}