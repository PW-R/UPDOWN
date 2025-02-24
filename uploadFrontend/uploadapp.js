async function addFile() {
  const fileInput = document.getElementById("formFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Plaese select a file");
    console.error("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const text = await response.text(); // Read response as text for debugging
    console.log("Server response:", text);

    try {
      const result = JSON.parse(text); // Try parsing it as JSON
      console.log("JSON result:", result);
      if (result.fileUrl) {
        console.log("File URL received:", result.fileUrl);
        displayFile(result.fileUrl, file.type)
      }
    } catch (jsonError) {
      console.error(" Invalid JSON response:", text);
      document.getElementById("status").innerText =
        "Server error: Invalid response format!";
    }
  } catch (error) {
    console.error(" Upload failed!", error);
    document.getElementById("status").innerText = "Upload failed";
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("fileDisplay");
  const fileInput = document.getElementById("formFile");

  document.querySelector(".dropfile").addEventListener("click", () => {
    fileInput.click();
  });
  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
  });
  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });
  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      addFile();
    }
});
fileInput.addEventListener("change", () => {
 
});
});
