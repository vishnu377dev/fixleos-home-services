document.addEventListener("DOMContentLoaded", function() {

    // --- FAKE DATA (This would come from your backend/API) ---
    const providerData = {
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        services: [
            { id: 1, name: "AC Service (Standard)", price: 499, active: true },
            { id: 2, name: "AC Installation", price: 1500, active: true },
            { id: 3, name: "Leaky Faucet Repair", price: 349, active: true },
            { id: 4, name: "Switchboard Repair", price: 299, active: false },
            { id: 5, name: "Ceiling Fan Installation", price: 400, active: true }
        ],
        feedback: [
            { rating: 5, customer: "S. Gupta", comment: "Very professional and quick work. Highly recommended." },
            { rating: 5, customer: "Anjali P.", comment: "Excellent service! Fixed the issue perfectly." },
            { rating: 4, customer: "Vikram R.", comment: "Good job, but was slightly late." }
        ]
    };
    
    // --- UI ELEMENTS ---
    const profileImage = document.getElementById('profileImage');
    const profileImageInput = document.getElementById('profileImageInput');
    const saveProfileInfoBtn = document.getElementById('saveProfileInfoBtn');
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const masterSaveBtn = document.getElementById('master-save-btn');

    // --- RENDER FUNCTIONS ---
    
    // Render working day toggles
    function renderWorkingDays() {
        const container = document.getElementById('working-days-container');
        const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        container.innerHTML = '';
        allDays.forEach(day => {
            const isChecked = providerData.workingDays.includes(day);
            container.innerHTML += `
                <div>
                    <input type="checkbox" class="btn-check" id="day-${day}" ${isChecked ? 'checked' : ''} autocomplete="off">
                    <label class="btn btn-outline-primary" for="day-${day}">${day}</label>
                </div>
            `;
        });
    }

    // Render service offerings
    function renderServiceOfferings() {
        const list = document.getElementById('service-offerings-list');
        list.innerHTML = '';
        providerData.services.forEach(service => {
            list.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${service.name}</h6>
                        <div class="input-group input-group-sm mt-1" style="max-width: 150px;">
                           <span class="input-group-text">₹</span>
                           <input type="number" class="form-control" value="${service.price}" aria-label="Price">
                        </div>
                    </div>
                    <div class="form-check form-switch fs-5">
                        <input class="form-check-input" type="checkbox" role="switch" ${service.active ? 'checked' : ''}>
                    </div>
                </li>
            `;
        });
    }

    // Render feedback
    function renderFeedback() {
        const list = document.getElementById('feedback-list');
        list.innerHTML = '';
        providerData.feedback.forEach(fb => {
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += `<i class="fas fa-star ${i < fb.rating ? 'text-warning' : 'text-muted'}"></i>`;
            }
            list.innerHTML += `
                <div class="feedback-item mb-3">
                    <div class="d-flex justify-content-between">
                        <strong>${fb.customer}</strong>
                        <div class="rating-stars">${stars}</div>
                    </div>
                    <p class="text-muted small mb-0">"${fb.comment}"</p>
                </div>
            `;
        });
    }





    
    
    // --- EVENT LISTENERS ---
    
    // Profile Picture Change
    profileImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => profileImage.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Save Personal Info from Modal
    saveProfileInfoBtn.addEventListener('click', function() {
        document.getElementById('profileName').textContent = document.getElementById('editFullName').value;
        document.getElementById('profileServices').textContent = document.getElementById('editProfileHeadline').value;
        editProfileModal.hide();
        showToast('Profile Updated', 'Your personal information has been updated.', 'success');
    });
    
    // Master "Save All Changes" button
    masterSaveBtn.addEventListener('click', function(){
        this.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...`;
        this.disabled = true;

        // In a real application, you would collect all data here and send to a server.
        setTimeout(() => {
            this.innerHTML = `<i class="fas fa-save me-2"></i>Save All Changes`;
            this.disabled = false;
            showToast('All Changes Saved!', 'Your profile has been successfully updated on our servers.', 'success');
        }, 1500);
    });

    // Sidebar Toggle
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("wrapper").classList.toggle("toggled");
        });
    }

    // --- HELPER FUNCTION FOR TOAST NOTIFICATIONS ---
    function showToast(title, message, type) {
        const toastEl = document.getElementById('profileToast');
        const toastTitle = document.getElementById('toast-title');
        const toastBody = document.getElementById('toast-body');
        
        toastTitle.textContent = title;
        toastBody.textContent = message;

        toastEl.className = 'toast'; // Reset classes
        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'danger') {
            toastEl.classList.add('bg-danger', 'text-white');
        }
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    // --- INITIALIZE PAGE ---
    renderWorkingDays();
    renderServiceOfferings();
    renderFeedback();
});











