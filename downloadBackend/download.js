document.addEventListener("DOMContentLoaded", async () => {
    const fileListContainer = document.querySelector(".download-table tbody");
    const selectFileBtn = document.getElementById("selectfile");
    const allFileBtn = document.getElementById("allfile");
    const cancelFileBtn = document.getElementById("cancelfile");
    const downloadFileBtn = document.getElementById("downloadfile");
    const deleteFileBtn = document.getElementById("deletefile");

    let selectedFiles = new Set();
    let isSelecting = false;

    async function loadFiles() {
        fileListContainer.innerHTML = "<tr><td colspan='1'>Loading...</td></tr>"; 
        try {
            const response = await fetch("http://localhost:3000/files");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const files = await response.json();
            fileListContainer.innerHTML = ""; 
            if(files.length === 0){
                fileListContainer.innerHTML = "<tr><td colspan='1'>No files found.</td></tr>";
                return;
            }

            files.forEach((file) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="task-card">
                        <span>${file}</span>
                        <input type="checkbox" class="file-checkbox" value="${file}" style="display: none;">
                    </td>
                `;
                fileListContainer.appendChild(row);
            });

            document.querySelectorAll(".file-checkbox").forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        selectedFiles.add(checkbox.value);
                    } else {
                        selectedFiles.delete(checkbox.value);
                    }
                });
            });
        } catch (error) {
            console.error("Error loading files:", error);
            fileListContainer.innerHTML = "<tr><td colspan='1'>Error loading files.</td></tr>";
        }
    }

    selectFileBtn.addEventListener("click", () => {
        isSelecting = true;
        selectedFiles.clear();
        document.querySelectorAll(".file-checkbox").forEach((checkbox) => {
            checkbox.style.display = "inline-block";
            checkbox.disabled = false;
        });
    });

    allFileBtn.addEventListener("click", () => {
        selectedFiles.clear();
        document.querySelectorAll(".file-checkbox").forEach((checkbox) => {
            checkbox.checked = true;
            selectedFiles.add(checkbox.value);
        });
    });

    cancelFileBtn.addEventListener("click", () => {
        isSelecting = false;
        selectedFiles.clear();
        document.querySelectorAll(".file-checkbox").forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.style.display = "none";
        });
    });

    downloadFileBtn.addEventListener("click", async () => {
        if (selectedFiles.size === 0) {
            alert("Please select at least one file to download.");
            return;
        }

        for (const file of selectedFiles) {
            try {
                const response = await fetch(`http://localhost:3000/download/${file}`);
                if (!response.ok) {
                    throw new Error(`Failed to download ${file}, status: ${response.status}`);
                }

                const blob = await response.blob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // alert(`Downloaded ${file} successfully.`);
            } catch (error) {
                console.error("Error downloading file:", error);
                alert(`Error downloading ${file}: ${error.message}`);
            }
        }
    });

    deleteFileBtn.addEventListener("click", async () => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ที่เลือก?")) {
            return;
        }
        for (const file of selectedFiles) {
            try {
                
                const response = await fetch(`http://localhost:3000/delete/${encodeURIComponent(file)}`, { method: "DELETE" });
                if (!response.ok) {
                    throw new Error(`Failed to delete ${file}, status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error deleting ${file}:`, error);
            }
        }
        loadFiles();
    });

    loadFiles();
});