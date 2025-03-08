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
    placesTableBody.innerHTML = '';
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
                    <a href="javascript:OpenEditPlace(this, ${place.id}, '${place.name}', '${place.city}', '${place.country}', '${place.description}', '${place.location_url}' );">📝 تعديل</a>
                </div>
            </td>
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
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="4" style="height: 50px;"></td>`; // Empty but visible
    placesTableBody.appendChild(emptyRow);
}
window.OpenEditPlace = async function (element, placeId, placeName, placeCity, placeCountry, placeDiscription, placeURL) {
    document.getElementById('placeNameEdit').value = placeName;
    document.getElementById('placeCityEdit').value = placeCity;
    document.getElementById('placeDescriptionEdit').value = placeDiscription;
    document.getElementById('placeURLEdit').value = placeURL;
    document.getElementById('placeCountryEdit').value = placeCountry;
    document.getElementById('placeID').value = placeId;
    const editPlaceModal = new bootstrap.Modal(document.getElementById('editPlaceModal'));
    editPlaceModal.show();
}
const editPlaceBTN = document.getElementById('editPlaceBTN');
editPlaceBTN.addEventListener('click', async  function() {
    const placeName = document.getElementById('placeNameEdit').value;
    const placeCity = document.getElementById('placeCityEdit').value;
    const placeDiscription = document.getElementById('placeDescriptionEdit').value;
    const placeURL = document.getElementById('placeURLEdit').value;
    const placeCountry = document.getElementById('placeCountryEdit').value;
    const placeID = document.getElementById('placeID').value;
    var apiUrl = serverUrl + 'places/' + placeID;
    const body = {
        name : placeName,
        city : placeCity,
        description : placeDiscription,
        location_url : placeURL,
        country : placeCountry  
    };
    const response = await apiPostOrPut(apiUrl, 'PUT', body);
    Swal.fire({
        position: "center",
        icon: "success",
        title: "تم تعديل المكان بنجاح",
        showConfirmButton: false,
        timer: 1500
    });
    const editPlaceModal = new bootstrap.Modal(document.getElementById('editPlaceModal'));
    editPlaceModal.hide();
    fetchPlaces();

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
    const placeDiscription = document.getElementById('placeDiscription').value;
    const placeURL = document.getElementById('placeURL').value;
    const placeCountry = document.getElementById('placeCountry').value;
    const fileNamePreview = document.getElementById('fileNamePreview').value;
    const fileInput = document.getElementById('attachFileInput');
    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
        Swal.fire('الرجاء اختيار صورة');
        return;
    }
    if(placeName == '' || placeCity == '' || placeCountry == '') {
        Swal.fire('الرجاء ادخال جميع البيانات');
        return;
    }
    var apiUrl = serverUrl + 'places';
    const formData = new FormData();
    formData.append('image_path', selectedFile);
    formData.append('image_name', fileNamePreview);
    formData.append('name', placeName);
    formData.append('city', placeCity);
    formData.append('country', placeCountry);
    formData.append('description', placeDiscription);
    formData.append('location_url', placeURL);
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
            document.getElementById('placeURL').value = '';
            document.getElementById('placeName').value = '';
            document.getElementById('placeCity').value = '';
            document.getElementById('placeCountry').value = '';
            document.getElementById('fileNamePreview').value = '';
            document.getElementById('filePreview').innerHTML = '';
            Swal.fire({
                position: "center",
                icon: "success",
                title: "تم انشاء المكان بنجاح",
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById('closeCreateModal').click();
            fetchPlaces();
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
                position: "center",
                icon: "success",
                title: "تم حذف المكان بنجاح",
                showConfirmButton: false,
                timer: 1500
            });
            fetchPlaces();
        } else if (result.isDenied) {
          Swal.fire("لم يتم حذف المكان", "", "info");
        }
      });
}