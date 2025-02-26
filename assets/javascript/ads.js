import { apiFetch, apiPostOrPut } from './apiHelper.js';
const baseUrl = 'http://127.0.0.1:8000/api/';
const serverUrl = 'http://147.93.63.182/api/';
const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
if(!accessToken || accessToken == null || role == 0){
    window.location.href = 'sign-in.html';
}else {
    fetchAds();
}
function fetchAds() {
    const apiUrl = serverUrl + 'admin/ads';
    apiFetch(apiUrl).then((data) => {
        console.log(data.ads);
        displayAds(data.ads);
    });
}
function displayAds(ads) {
    const adsTableBody = document.getElementById('adsTableBody');
    adsTableBody.innerHTML = '';
    ads.forEach((ad) => {
        const row = document.createElement('tr');
        var publish ="";
        var new_publish_value;
        if(ad.is_published){
            publish =" 🫣 اخفاء";
            new_publish_value = 0;
        }else {
            publish=" ✍🏻 نشر";
            new_publish_value = 1;
        }
        row.innerHTML = `
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                    <img src="${ad.public_url}" class="avatar avatar-sm me-3 " alt="user1">
                    </div>
                    <div class="d-flex flex-column justify-content-center" style="padding-right:0.25rem">
                    <h6 class="mb-0 text-sm"> ${ad.title}</h6>
                    <p class="text-xs text-secondary mb-0"></p>
                    </div>
                </div>
            </td>
            <td class="align-middle text-center">${ad.description}</td>
            <td class="align-middle text-center">${ad.is_published ? 'نعم' : 'لأ'}</td>
            <td class="align-middle text-center">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs dropdown-toggle">
                    <i class="fa fa-ellipsis-v"></i>
                </a>
                <div class="dropdown-content">
                    <a href="javascript:deleteAd(this, ${ad.id});">❌ حذف</a>
                    <a href="javascript:publishAd(this, ${ad.id});">${publish}</a>
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
        adsTableBody.appendChild(row);
    });
}

// Close dropdown if clicking outside of the table row
document.addEventListener('click', function (e) {
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
});

const createAdBTN = document.getElementById('createAdBTN');
createAdBTN.addEventListener('click', async  function() {
    const apiUrl = serverUrl + 'ads';
    const title = document.getElementById('adName').value;
    const description = document.getElementById('adDescription').value;
    const fileNamePreview = document.getElementById('fileNamePreview').value;
    const fileInput = document.getElementById('attachFileInput');
    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
        Swal.fire('الرجاء اختيار صورة');
        return;
    }
    if(title == '' || description == '') {
        Swal.fire('الرجاء ادخال العنوان والوصف');
        return;
    }
    const formData = new FormData();
    formData.append('image_path', selectedFile);
    formData.append('image_name', fileNamePreview);
    formData.append('title', title);
    formData.append('description', description);
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
            Swal.fire({
                position: "center",
                icon: "success",
                title: "تم انشاء الاعلان بنجاح",
                showConfirmButton: false,
                timer: 1500
              });
            document.getElementById('adName').value = '';
            document.getElementById('adDescription').value = '';
            document.getElementById('fileNamePreview').value = '';
            document.getElementById('filePreview').innerHTML = '';
            document.getElementById('closeAdsModal').click();
            fetchAds();
         }
    } catch (error) {
        console.error('Error:', error);
    }

});

window.deleteAd = async function (element,id) {
    console.log("Deleting ad ID:", id);
    Swal.fire({
        title: "هل انت متاكد من حذف الاعلان ؟!",
        showDenyButton: true,
         confirmButtonText: "أحذف !",
        denyButtonText: `لا تحذف !`
      }).then(async (result) => {
        if (result.isConfirmed) {
            const apiUrl = serverUrl + `ads/${id}`;
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
                title: "تم حذف الاعلان بنجاح",
                showConfirmButton: false,
                timer: 1500
              });
              fetchAds();
        } else if (result.isDenied) {
          Swal.fire("لم يتم حذف الاعلان", "", "info");
        }
      });
}

window.publishAd = async function (element, id) {
    const apiUrl = serverUrl + `ads/${id}/publish`;
    try {
        const response = await apiPostOrPut(apiUrl, 'PATCH', {});
        console.log(response);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "تم تحديث حالة النشر بنجاح",
            showConfirmButton: false,
            timer: 1500
          });
        fetchAds();
    } catch (error) {
        console.error('Error :', error);
        alert('Saver issue, contact support');
    }
}