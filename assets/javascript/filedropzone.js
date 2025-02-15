const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('attachFileInput');
const filePreview = document.getElementById('filePreview');

// Open file dialog when clicking on the drop zone
dropZone.addEventListener('click', () => fileInput.click());

// Show file name when selected
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    filePreview.textContent = `تم اختيار الملف: ${file.name}`;
    //document.getElementById('fileNamePreview').value = file.name;
  }
});

// Handle drag-and-drop events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragging');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');

  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;  // Assign the dropped file to the input
    filePreview.textContent = `تم اختيار الملف: ${file.name}`;
    //document.getElementById('fileNamePreview').value = file.name;
  }
});
