async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        document.getElementById("status").innerText = result.message;
    } catch (error) {
        document.getElementById("status").innerText = "อัปโหลดล้มเหลว!";
    }
}
    