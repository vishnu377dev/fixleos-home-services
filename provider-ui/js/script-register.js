document.addEventListener('DOMContentLoaded', () => {

    // --- MULTI-STEP FORM LOGIC ---
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const stepItems = document.querySelectorAll('.step-item');
    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                updateFormSteps();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateFormSteps();
            }
        });
    });

    function updateFormSteps() {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        stepItems.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // --- KYC UPLOAD LOGIC ---
    const uploadBoxes = document.querySelectorAll('.upload-box');

    uploadBoxes.forEach(box => {
        const input = box.querySelector('.file-input');
        const previewContainer = box.querySelector('.preview-container');
        const previewImage = box.querySelector('.preview-image');
        const uploadLabel = box.querySelector('.upload-label');
        const removeBtn = box.querySelector('.remove-btn');

        // Handle file selection via click
        input.addEventListener('change', () => {
            const file = input.files[0];
            if (file) {
                displayPreview(file);
            }
        });

        // Handle Drag & Drop
        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.classList.add('dragover');
        });

        box.addEventListener('dragleave', () => {
            box.classList.remove('dragover');
        });

        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                input.files = e.dataTransfer.files; // Assign file to input
                displayPreview(file);
            }
        });
        
        // Handle remove button
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the label click
            input.value = ''; // Clear the file input
            previewImage.src = '';
            previewContainer.style.display = 'none';
            uploadLabel.style.display = 'block';
        });

        function displayPreview(file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                uploadLabel.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    document.getElementById('registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would gather all the form data and send it to your backend
        alert('Form submitted for verification! (This is a demo)');
        // Example of gathering data:
        const formData = new FormData(e.target);
        // Add file data
        formData.append('aadhar_card', document.getElementById('aadhar-upload').files[0]);
        formData.append('pan_card', document.getElementById('pan-upload').files[0]);
        
        console.log('Form data to be sent to server:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    });

});