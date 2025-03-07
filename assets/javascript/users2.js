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
        fetchUsersDropDown(data.users);
        displayCustomers(data.users);
        
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}

function displayCustomers(customers) {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '';
    customers.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.classList.add('customer-item');
        customerItem.innerHTML = `
            <img src="assets/img/team-3.jpg" alt="profile">
            <div>
                <a href="#"> <div>${customer.name}</div> </a>
                <small>${customer.phone}</small>
            </div>
        `;
        customerItem.dataset.name = customer.name.toLowerCase(); // Store lowercase name for easy search

        const link = customerItem.querySelector('a');
        link.dataset.id = customer.id;
        link.dataset.name = customer.name;
        link.dataset.phone = customer.phone;
        link.dataset.address = customer.address;
        link.dataset.city = customer.city;
        link.dataset.containers_count = customer.containers_count;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            fetchUploadedFiles(this, customer.id);
            displayCustomerInfo(this);
        });

        customerList.appendChild(customerItem);
    });
}

// Filter function (runs when user types in search box)
document.getElementById('customerSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const items = document.querySelectorAll('#customerList .customer-item');
    items.forEach(item => {
        const name = item.dataset.name; // Get the stored name
        if (name.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});
function fetchUsersDropDown(customers){
    console.log("Fetching users... into dropdown");
    const userList = document.getElementById('userList');
 
    userList.innerHTML = '';
     customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.text = customer.name;
        userList.add(option);
     });
}
window.displayCustomerInfo = function (element) {
    const customerId = element.dataset.id;
    const customerName = element.dataset.name;
    const customerPhone = element.dataset.phone;
    const customerAddress = element.dataset.address;
    const customerCity = element.dataset.city;
    const containersCount = element.dataset.containers_count;
    
    document.getElementById('customerName').innerHTML = "<strong>الاسم:</strong> " + customerName;
    document.getElementById('customerPhone').innerHTML = "<strong>الجوال:</strong> " + customerPhone;
    document.getElementById('customerCity').innerHTML = "<strong>المدينة:</strong> " + customerCity;
    document.getElementById('customerAddress').innerHTML = "<strong>العنوان:</strong> " + customerAddress;
    document.getElementById('containersCount').innerHTML = "<strong>عدد الحاويات:</strong> " + containersCount;
    document.getElementById('customerId').value = customerId;

    document.getElementById('changePassword').disabled = false;
    document.getElementById('editCustomer').disabled = false;
    document.getElementById('deleteCustomer').disabled = false;
    document.getElementById('createContainerBTN').disabled = false;
    document.getElementById('createBankStatmentBTN').disabled = false;
    
    // Filling the edit form.. !
    document.getElementById('customerNameEdit').value = customerName;
    document.getElementById('customerPhoneEdit').value = customerPhone;
    document.getElementById('customerCityEdit').value = customerCity;
    document.getElementById('customerAddressEdit').value = customerAddress;
}

window.openChangePasswordModal = function () {
    const restPasswordModal = new bootstrap.Modal(document.getElementById('restPasswordModal'));
    restPasswordModal.show();
 }


 const restPasswordBTN = document.getElementById('restPasswordBTN');
 restPasswordBTN.addEventListener('click', async  function() {
     const newPassword = document.getElementById('newPassword').value;
     const userIdRestPassword = document.getElementById('customerId').value;
     if(userIdRestPassword == '' || userIdRestPassword == null || userIdRestPassword == undefined) {
        Swal.fire('قم باختيار زبون اولا !');
        return;
     }
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

 window.deleteCustomer = function () {
     Swal.fire({
         title: "هل انت متاكد من حذف الحساب ؟!",
         showDenyButton: true,
          confirmButtonText: "أحذف !",
         denyButtonText: `لا تحذف !`
       }).then(async (result) => {
         if (result.isConfirmed) {
             const id = document.getElementById('customerId').value;
             if(id == '' || id == null || id == undefined) {
                Swal.fire('قم باختيار زبون اولا !');
                return;
             }
             const apiUrl = serverUrl + `users/${id}`;
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
                 title: "تم حذف الزبون بنجاح",
                 showConfirmButton: false,
                 timer: 1500
             });
             fetchCustomers();
             restCustomerInfo();
         } else if (result.isDenied) {
           Swal.fire("لم يتم حذف الزبون", "", "info");
         }
       });
 }
 function restCustomerInfo(){
    document.getElementById('changePassword').disabled = true;
    document.getElementById('editCustomer').disabled = true;
    document.getElementById('deleteCustomer').disabled = true;
    document.getElementById('createContainerBTN').disabled = true;
    document.getElementById('createBankStatmentBTN').disabled = true;
    document.getElementById('customerName').innerHTML = "<strong>الاسم:</strong> " + '-';
    document.getElementById('customerPhone').innerHTML = "<strong>الجوال:</strong> " + '-';
    document.getElementById('customerCity').innerHTML = "<strong>المدينة:</strong> " + '-';
    document.getElementById('customerAddress').innerHTML = "<strong>العنوان:</strong> " + '-';
    document.getElementById('containersCount').innerHTML = "<strong>عدد الحاويات:</strong> " + '-';
    document.getElementById('customerId').value = '';
    document.getElementById("containerFiles2").innerHTML = "";
    document.getElementById("bankstatmentTitle").innerHTML = "";
    document.getElementById('bankstatmentIcon').src = '';
    document.getElementById('bankstatmentIcon').alt = '';
 }

 window.fetchUploadedFiles = async function (element,userId) {
     console.log("Fetching files for user ID:", userId);
     try {
         const apiUrl = serverUrl + "users/" + userId + "/uploaded-files";
         apiFetch(apiUrl).then(data => { 
             console.log(data.files);
             displayFiles(data.files);
         }).catch(error => {
             console.error('Error fetching users:', error);
         });
 
     } catch (error) {
         console.error("Error fetching files:", error);
     }
 }

 function displayFiles(files) {
    const containerFilesDiv = document.getElementById("containerFiles2"); // Updated ID
    const bankStatmentDiv = document.getElementById('bankstatmentTitle');
    containerFilesDiv.innerHTML = "";
    bankStatmentDiv.innerHTML = "";
    document.getElementById('bankstatmentIcon').src = '';
    document.getElementById('bankstatmentIcon').alt = '';
    files.forEach(file => {
        const fileElement = createFileElement(file);
        if (file.type === "container") {
            containerFilesDiv.appendChild(fileElement);
        }else {
           
            bankStatmentDiv.innerHTML = file.name;
            document.getElementById('bankstatmentIcon').src = getFileIcon(file.extension);
            document.getElementById('bankstatmentIcon').alt = file.extension;
            bankStatmentDiv.style.cursor = "pointer";
            bankStatmentDiv.addEventListener("click", () => {
                window.open(file.url, "_blank");
            });
        }
        
    });
}

function createFileElement(file) {
    const fileDiv = document.createElement("div");
    fileDiv.classList.add("file-item");
    const dateSpan = document.createElement("span");
    const timestamp = file.date;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    dateSpan.textContent = formattedDate; 

    const nameSpan = document.createElement("span");
    nameSpan.textContent = file.name;

    const fileIcon = document.createElement("img");
    fileIcon.classList.add("file-icon");
    fileIcon.src = getFileIcon(file.extension);  // Use your existing icon logic
    fileIcon.alt = file.extension;

    fileDiv.appendChild(dateSpan);
    fileDiv.appendChild(nameSpan);
    fileDiv.appendChild(fileIcon);

    // Optional: If you want to make the whole item clickable to download/view the file
    fileDiv.style.cursor = "pointer";
    fileDiv.addEventListener("click", () => {
        window.open(file.url, "_blank");
    });

    return fileDiv;
}

function getFileIcon(extension) {
    const fileIcons = {
        "pdf": "https://cdn-icons-png.flaticon.com/512/337/337946.png",
        "doc": "https://cdn-icons-png.flaticon.com/512/732/732220.png",
        "docx": "https://cdn-icons-png.flaticon.com/512/732/732220.png",
        "xls": "https://cdn-icons-png.flaticon.com/512/732/732220.png",
        "xlsx": "https://cdn-icons-png.flaticon.com/512/732/732220.png",
        "png": "https://cdn-icons-png.flaticon.com/512/732/732212.png",
        "jpg": "https://cdn-icons-png.flaticon.com/512/732/732212.png",
        "jpeg": "https://cdn-icons-png.flaticon.com/512/732/732212.png",
        "gif": "https://cdn-icons-png.flaticon.com/512/732/732212.png"
    };
    return fileIcons[extension] || "https://cdn-icons-png.flaticon.com/512/564/564619.png";
}

const createCustomerBTN = document.getElementById('createCustomerBTN');
createCustomerBTN.addEventListener('click', async  function() {
    console.log("Create Customer Button Clicked");
    const apiUrl = serverUrl + 'users';
    const name = document.getElementById('customerNameCreate').value;
    const email = document.getElementById('customerEmailCreate').value;
    const phone = document.getElementById('customerPhoneCreate').value;
    const password = document.getElementById('customerPasswordCreate').value;
    const address = document.getElementById('customerAddressCreate').value;
    const city = document.getElementById('customerCityCreate').value;
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
        document.getElementById('customerNameCreate').value = '';
        document.getElementById('customerEmailCreate').value = '';
        document.getElementById('customerPhoneCreate').value = '';
        document.getElementById('customerPasswordCreate').value = '';
        document.getElementById('customerAddressCreate').value = '';
        document.getElementById('customerCityCreate').value = '';
        Swal.fire({
            position: "center",
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
        const apiUrl = serverUrl + 'user/notifications/send';
        const response = await apiPostOrPut(apiUrl, 'POST', body);
        document.getElementById('notificationSubject').value = '';
        document.getElementById('notificationBody').value = '';
        // document.getElementById('userList').selectedOptions.forEach((option) => {
        //     option.selected = false;
        // });
        document.getElementById('userSelection').classList.add('d-none');
        Swal.fire({
            position: "center",
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

const createBankStatmentBTN = document.getElementById('createBankStatmentBTN');
createBankStatmentBTN.addEventListener('click', async  function() {
    document.getElementById('containerTypeDiv').style.display = 'none';
    document.getElementById('fileType').value = 'Bank Statement';
    const attachFileModal = new bootstrap.Modal(document.getElementById('attachFileModal'));
    attachFileModal.show();
});

const createContainerBTN = document.getElementById('createContainerBTN');
createContainerBTN.addEventListener('click', async  function() {
    document.getElementById('containerTypeDiv').style.display = 'block';
    document.getElementById('fileType').value = 'Container';
    const attachFileModal = new bootstrap.Modal(document.getElementById('attachFileModal'));
    attachFileModal.show();
});

const attachFileBTN = document.getElementById('attachFileBTN');
attachFileBTN.addEventListener('click', async  function() {
    const userIdAttachFile = document.getElementById('customerId').value;
    const fileNamePreview = document.getElementById('fileNamePreview').value;
    const containerType = document.getElementById('containerType').value;
    const fileTypeSwitch = document.getElementById('fileTypeSwitch');
    const switchValue = document.getElementById('fileType').value
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
            document.getElementById('fileType').value = '';
            document.getElementById('filePreview').innerHTML = '';
        } else {
            console.error('Error:', result);
            Swal.fire("حدث خلل", "يوجد خلل في الملف المرفق", "danger");
        }
    } catch (error) {
        console.error('Error:', error);
    }

});

const editCustomerBTN = document.getElementById('editCustomerBTN');
editCustomerBTN.addEventListener('click', async  function() {
    const userId = document.getElementById('customerId').value;
    const apiUrl = serverUrl + `users/${userId}/update`;
    const name = document.getElementById('customerNameEdit').value;
     const phone = document.getElementById('customerPhoneEdit').value;
    const address = document.getElementById('customerAddressEdit').value;
    const city = document.getElementById('customerCityEdit').value;
    if(name == '' || phone == '' || address == '' || city == '') {
        Swal.fire('الرجاء ادخال جميع البيانات');
        return;
    }
    const body = {
        name: name,
         phone: phone,
        address: address,
        city: city
    };
    try {
        const response = await apiPostOrPut(apiUrl, 'PATCH', body);
        console.log(response);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "تم تعديل الزبون بنجاح",
            showConfirmButton: false,
            timer: 1500
        });
        document.getElementById('closeEditModal').click();
        fetchCustomers();
    } catch (error) {
        console.error('Error:', error);
        alert('Saver issue, contact support');
    }

});
