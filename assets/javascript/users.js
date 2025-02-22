import { apiFetch, apiPostOrPut } from './apiHelper.js';
const baseUrl = 'http://127.0.0.1:8000/api/';
const serverUrl = 'http://147.93.63.182/api/';
const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
if(!accessToken || accessToken == null || role == 0){
    window.location.href = 'sign-in.html';
}else {
    fetchCustomers();
}

function fetchCustomers(){
    const apiUrl = serverUrl + `users`;
    apiFetch(apiUrl).then(data => { 
        console.log(data.users);
        displayCustomers(data.users);
        fetchUsersDropDown(data.users);
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}
function fetchUsersDropDown(customers){
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.text = customer.name;
        userList.add(option);
    });
}
function displayCustomers(customers) {
    const tableBody = document.getElementById('customersTableBody');
    tableBody.innerHTML = '';
    const usersArrayImgs = ['team-2','team-3','team-4','team-1'];
    customers.forEach(customer => {
        const randomUser = usersArrayImgs[Math.floor(Math.random() * usersArrayImgs.length)];
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="assets/img/${randomUser}.jpg" class="avatar avatar-sm me-3 " alt="user1">
                          </div>
                          <div class="d-flex flex-column justify-content-center" style="padding-right:0.25rem">
                            <h6 class="mb-0 text-sm"> ${customer.name}</h6>
                            <p class="text-xs text-secondary mb-0">${customer.phone}</p>
                          </div>
                        </div>
                      </td>
             <td>
                <p class="text-xs font-weight-bold mb-0">${customer.address}</p>
                <p class="text-xs text-secondary mb-0">${customer.city}</p>
             </td>
            <td class="align-middle text-center"><p class="text-xs font-weight-bold mb-0">${customer.containers_count}</p></td>
            <td class="align-middle text-center">
               <a href="javascript:;" class="text-secondary font-weight-bold text-xs dropdown-toggle">
                    <i class="fa fa-ellipsis-v"></i>
                </a>
                <div class="dropdown-content">
                    <a href="javascript:openChangePasswordModal(this, ${customer.id});">📝 إعادة تعيين كلمة المرور</a>
                    <a href="javascript:deleteUser(this, ${customer.id});">❌ حذف</a>
                    <a href="javascript:openContainerModal(this, ${customer.id});">📎 أرفاق ملف</a>
                     <a href="javascript:fetchUploadedFiles(this,${customer.id});">👀 عرض الملفات</a>
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
        tableBody.appendChild(row);
    });
}
window.deleteUser = function (element,id) {
    Swal.fire({
        title: "هل انت متاكد من حذف الحساب ؟!",
        showDenyButton: true,
         confirmButtonText: "أحذف !",
        denyButtonText: `لا تحذف !`
      }).then(async (result) => {
        if (result.isConfirmed) {
            const apiUrl = serverUrl + `users/${id}`;
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
                title: "تم حذف الزبون بنجاح",
                showConfirmButton: false,
                timer: 1500
            });
            fetchCustomers();
        } else if (result.isDenied) {
          Swal.fire("لم يتم حذف الزبون", "", "info");
        }
      });
}
window.openContainerModal = function (element,id) {
    document.getElementById('userIdAttachFile').value = id;
    const attachFileModal = new bootstrap.Modal(document.getElementById('attachFileModal'));
    attachFileModal.show();
}
window.openChangePasswordModal = function (element,id) {
    document.getElementById('userIdRestPassword').value = id;
    const restPasswordModal = new bootstrap.Modal(document.getElementById('restPasswordModal'));
    restPasswordModal.show();
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

const restPasswordBTN = document.getElementById('restPasswordBTN');
restPasswordBTN.addEventListener('click', async  function() {
    const newPassword = document.getElementById('newPassword').value;
    const userIdRestPassword = document.getElementById('userIdRestPassword').value;
    const apiUrl = serverUrl + `users/${userIdRestPassword}/reset-password`;
    if(newPassword == '') {
        Swal.fire('الرجاء ادخال كلمة المرور الجديدة');
        return;
    }
    const body = {
        password: newPassword
    };
        try {
            const response = await apiPostOrPut(apiUrl, 'PATCH', body);
            document.getElementById('newPassword').value = '';
            document.getElementById('userIdRestPassword').value = '';
            Swal.fire("تم التغيير بنجاح", "تم تغيير كلمة المرور بنجاح", "success");
        } catch (error) {
            console.error('Error :', error);
            Swal.fire('Saver issue, contact support');
        }

});

const sendNoficationBTN = document.getElementById('sendNoficationBTN');
sendNoficationBTN.addEventListener('click', async  function() {
    console.log("sendNoficationBTN clicked");
    const subject = document.getElementById('notificationSubject').value;
    const message = document.getElementById('notificationBody').value;
    const notificationType = document.querySelector('input[name="notificationType"]:checked').value;
    let userIds = [];
    if (notificationType === 'C') {
        const selectedOptions = document.getElementById('userList').selectedOptions;
        userIds = Array.from(selectedOptions).map(option => option.value);
    }

    // Validate required fields
    if (!subject || !message) {
        Swal.fire('الرجاء إدخال الموضوع والمحتوى');
        return;
    }

    if (notificationType === 'C' && userIds.length === 0) {
        Swal.fire('الرجاء اختيار الزبائن');
        return;
    }
    const body = {
        subject,
        message,
        notificationType,
        user_ids: notificationType === 'C' ? userIds : []  // Send user_ids only if type C is selected
    };

    try {
        const apiUrl = serverUrl + '/user/notifications/send';
        const response = await apiPostOrPut(apiUrl, 'POST', body);
        document.getElementById('notificationSubject').value = '';
        document.getElementById('notificationBody').value = '';
        document.getElementById('userList').selectedOptions.forEach((option) => {
            option.selected = false;
        });
        document.getElementById('userSelection').classList.add('d-none');
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "تم إرسال الإشعار بنجاح",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('خطأ في الإرسال، الرجاء المحاولة مرة أخرى');
    }

});

const attachFileBTN = document.getElementById('attachFileBTN');
attachFileBTN.addEventListener('click', async  function() {
    const userIdAttachFile = document.getElementById('userIdAttachFile').value;
    const fileNamePreview = document.getElementById('fileNamePreview').value;
    const containerType = document.getElementById('containerType').value;
    const fileTypeSwitch = document.getElementById('fileTypeSwitch');
    const switchValue = fileTypeSwitch.checked ? 'Container' : 'Bank Statement';
    console.log('Selected File Type:', switchValue);
    const fileInput = document.getElementById('attachFileInput');
    const selectedFile = fileInput.files[0];
    if (!selectedFile || fileNamePreview == '') {
        Swal.fire('الرجاء اختيار الملف وادخل اسم الملف');
        return;
    }
    var apiUrl ="";
    const formData = new FormData();
    if(switchValue == 'Container'){
        apiUrl = serverUrl + `users/${userIdAttachFile}/containers`;
        formData.append('file_path', selectedFile);
        formData.append('file_name', fileNamePreview);
        formData.append('type', containerType);
    }else {
        apiUrl = serverUrl + `users/${userIdAttachFile}/account-statments`;
        formData.append('file_path', selectedFile);
        formData.append('file_name', fileNamePreview);
    }
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
            Swal.fire("تم ارفاق الملف", "تم ارفاق الملف بنجاح", "success");
            document.getElementById('fileNamePreview').value = '';
            document.getElementById('attachFileInput').value = '';
            document.getElementById('filePreview').innerHTML = '';
        } else {
            console.error('Error:', result);
        }
    } catch (error) {
        console.error('Error:', error);
    }

});
const fileTypeSwitch = document.getElementById('fileTypeSwitch');
const containerTypeDiv = document.getElementById('containerTypeDiv');

// Initial state check (on page load)
toggleContainerTypeDiv(fileTypeSwitch.checked);

// Add event listener to switch
fileTypeSwitch.addEventListener('change', function () {
  toggleContainerTypeDiv(this.checked);
});

// Function to toggle the visibility of containerTypeDiv
function toggleContainerTypeDiv(isSwitchOn) {
  if (isSwitchOn) {
    containerTypeDiv.style.display = 'block';  // Hide when the switch is on
  } else {
    containerTypeDiv.style.display = 'none';  // Show when the switch is off
  }
}



window.fetchUploadedFiles = async function (element,userId) {
    console.log("Fetching files for user ID:", userId);
    try {
        const apiUrl = serverUrl + "users/" + userId + "/uploaded-files";
        apiFetch(apiUrl).then(data => { 
            console.log(data.files);
            displayFiles(data.files);
            // Show the modal after data is loaded
            const modal = new bootstrap.Modal(document.getElementById("uploadedFilesModal"));
            modal.show();
        }).catch(error => {
            console.error('Error fetching users:', error);
        });

    } catch (error) {
        console.error("Error fetching files:", error);
    }
}
function displayFiles(files) {
    const containerFilesDiv = document.getElementById("containerFiles");
    const bankFilesDiv = document.getElementById("bankFiles");

    containerFilesDiv.innerHTML = "";
    bankFilesDiv.innerHTML = "";
    
    files.forEach(file => {
        const fileElement = createFileElement(file);
        if (file.type === "container") {
            containerFilesDiv.appendChild(fileElement);
        } else if (file.type === "bank") {
            bankFilesDiv.appendChild(fileElement);
        }
    });
}
// Function to create a file item
function createFileElement(file) {
    const fileDiv = document.createElement("div");
    fileDiv.classList.add("file-item");

    const fileIcon = getFileIcon(file.extension);
    fileDiv.innerHTML = `
        <a href="${file.url}" target="_blank" class="file-link">
            <img src="${fileIcon}" alt="${file.extension}" class="file-icon">
            <span class="file-name">${file.name}</span>
        </a>
    `;

    return fileDiv;
}

// Function to get file icon based on file type
function getFileIcon(extension) {
    const fileIcons = {
        "pdf": "assets/img/icons/pdf-icon.png",
        "doc": "assets/img/icons/word-icon.jpg",
        "docx": "assets/img/icons/word-icon.jpg",
        "xls": "assets/img/icons/excel-icon.png",
        "xlsx": "assets/img/icons/excel-icon.png",
        "png": "assets/img/icons/image-icon.png",
        "jpg": "assets/img/icons/image-icon.png",
        "jpeg": "assets/img/icons/image-icon.png",
        "gif": "assets/img/icons/image-icon.png"
    };
    return fileIcons[extension] || "assets/img/icons/default-file-icon.png";
}

const createCustomerBTN = document.getElementById('createCustomerBTN');
createCustomerBTN.addEventListener('click', async  function() {
    console.log("Create Customer Button Clicked");
    const apiUrl = serverUrl + 'users';
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const password = document.getElementById('customerPassword').value;
    const address = document.getElementById('customerAddress').value;
    const city = document.getElementById('customerCity').value;
    if(name == '' || email == '' || phone == '' || password == '' || address == '' || city == '') {
        Swal.fire('الرجاء ادخال جميع البيانات');
        return;
    }
    const body = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        address: address,
        city: city
    };
    try {
        const response = await apiPostOrPut(apiUrl, 'POST', body);
        console.log(response);
        document.getElementById('customerName').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerPassword').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerCity').value = '';
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "تم انشاء الزبون بنجاح",
            showConfirmButton: false,
            timer: 1500
        });
        document.getElementById('closeCreateModal').click();
        fetchCustomers();
    } catch (error) {
        console.error('Error :', error);
        alert('Saver issue, contact support');
    }

});