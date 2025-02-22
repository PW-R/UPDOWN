document.addEventListener("DOMContentLoaded", () => {

    const checkboxes = document.querySelectorAll(".file-checkbox");

    const selectfile = document.getElementById("selectfile");
    const allfile = document.getElementById("allfile");
    const cancelfile = document.getElementById("cancelfile");
    
    let selectedFiles = new Set();
    let isSelecting = false; // ค่าตัวแปรกำหนดว่าอนุญาตให้เลือกไฟล์หรือไม่

    
    checkboxes.forEach((checkbox) => {
        checkbox.disabled = true; 
    });

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (isSelecting) {
                if (checkbox.checked) {
                    selectedFiles.add(checkbox.value);
                } else {
                    selectedFiles.delete(checkbox.value);
                }
                console.log("Selected files:", Array.from(selectedFiles));
            } else {
                checkbox.checked = false; 
            }
        });
    });
    
    selectfile.addEventListener("click", () => {
        isSelecting = true;
        selectedFiles.clear();
        checkboxes.forEach((checkbox) => {
            checkbox.disabled = false; 
            if (checkbox.checked) {
                selectedFiles.add(checkbox.value);
            }
        });
    });


    allfile.addEventListener("click", () => {
        selectedFiles.clear();
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
            selectedFiles.add(checkbox.value);
        });
        console.log("All files selected:", Array.from(selectedFiles));
    });

    cancelfile.addEventListener("click", () => {
        selectedFiles.clear();
        checkboxes.forEach((checkbox) => (checkbox.checked = false));
        console.log("Selection cleared");
    });

})
