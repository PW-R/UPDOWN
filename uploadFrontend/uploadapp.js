document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById("formFiles");

  async function addFile() {
    if (!fileInput) {
      console.error("fileInput element not found");
      return;
    }

    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file");
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading...");
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      console.log("Server response:", text);

      try {
        const result = JSON.parse(text);
        console.log("JSON result:", result);
        if (result.fileUrl) {
          console.log("File URL received:", result.fileUrl);
          displayFile(result.fileUrl, file.type);
        }
      } catch (jsonError) {
        console.error("Invalid JSON response:", text);
        document.getElementById("status").innerText =
          "Server error: Invalid response format!";
      }
    } catch (error) {
      console.error("Upload failed!", error);
      document.getElementById("status").innerText = "Upload failed";
    }
  }
  document.getElementById('upload').addEventListener('click', addFile);


  function previewFile(event) {
    const file = event.target.files ? event.target.files[0] : event;
    const fileDisplay = document.getElementById("fileDisplay");

    if (!file) {
      console.error("No file selected");
      return;
    }

    const fileType = file.type;
    if (!fileType) {
      console.error("File type is undefined");
      return;
    }

    console.log("File type detected:", fileType);

    const fileUrl = URL.createObjectURL(file);

    if (fileType.startsWith("image/")) {
      fileDisplay.innerHTML = `<img src="${fileUrl}" alt="Preview Image" height="70%">`;
    } else if (fileType.startsWith("video/")) {
      fileDisplay.innerHTML = `<video src="${fileUrl}" height="auto" controls></video>`;
    } else if (fileType.startsWith("audio/")) {
      fileDisplay.innerHTML = `<audio src="${fileUrl}" controls></audio>`;
    } else if (fileType === "application/pdf") {
      fileDisplay.innerHTML = `<iframe src="${fileUrl}" width="100%" height="500px"></iframe>`;
    } else {
      fileDisplay.innerHTML = `<p>Preview not available for this file type: ${file.name}</p>`;
    }
  }

  document.getElementById("formFiles").addEventListener("change", previewFile);

  function displayFile(url, fileType) {
    const fileDisplay = document.getElementById("fileDisplay");
    fileDisplay.innerHTML = "";

    console.log("Displaying file:", url, fileType); // Debugging

    if (fileType.startsWith("image/")) {
      fileDisplay.innerHTML = `<img src="${url}" alt="Uploaded Image" height="70%">`;
    } else if (fileType.startsWith("video/")) {
      fileDisplay.innerHTML = `<video src="${url}" height="auto" controls></video>`;
    } else if (fileType.startsWith("audio/")) {
      fileDisplay.innerHTML = `<audio src="${url}" controls></audio>`;
    } else if (fileType === "application/pdf") {
      fileDisplay.innerHTML = `<iframe src="${url}" width="100%" height="500px"></iframe>`;
    } else {
      fileDisplay.innerHTML = `<a href="${url}" target="_blank">Download File</a>`;
    }
  }

  // Drop Area Handling
  const dropArea = document.getElementById("fileDisplay");
  const selectFilesButton = document.querySelector(".dropfile");

  selectFilesButton.addEventListener("click", () => {
    fileInput.click(); // When clicking button, open the file dialog
  });

  if (dropArea) {
    dropArea.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("dragover");
    });
  }

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files; // Assign dropped files to fileInput
      previewFile(files[0]); // Show preview
      addFile(); // Upload the file
    }
  });

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (files && files.length > 0) {
      previewFile(files[0]);
      addFile();
    } else {
      console.error("No file selected");
    }
  });
});
