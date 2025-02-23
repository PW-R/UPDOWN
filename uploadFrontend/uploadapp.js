document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fileInput");
});

async function addFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("กรุณาเลือกไฟล์ก่อน!");
        console.error("❌ ไม่พบ element fileInput");
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
    