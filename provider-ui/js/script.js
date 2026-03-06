







document.addEventListener("DOMContentLoaded", function() {
    
    // --- FAKE DATA (This would come from your backend/API) ---
    const allBookings = [
        { id: 101, status: 'new', customer: "Rohan Sharma", service: "AC Deep Cleaning", time: "Today, 4:00 PM", location: "Kondapur, Hyderabad", earnings: 599, notes: "AC is making a loud noise. Please check thoroughly." },
        { id: 102, status: 'new', customer: "Priya Singh", service: "Leaking Tap Repair", time: "Tomorrow, 11:00 AM", location: "Gachibowli, Hyderabad", earnings: 349, notes: "" },
        { id: 103, status: 'new', customer: "Amit Kumar", service: "Switch Board Installation", time: "Today, 6:00 PM", location: "Madhapur, Hyderabad", earnings: 299, notes: "Need to install 2 new switch boards in the living room." },
        { id: 98, status: 'ongoing', customer: "Sunita Reddy", service: "Full House Painting", time: "Started Yesterday", location: "Jubilee Hills, Hyderabad", earnings: 25000, notes: "2BHK apartment. Use Asian Paints." }
    ];

    const newRequestsContainer = document.getElementById('new-requests-container');
    const ongoingJobsContainer = document.getElementById('ongoing-jobs-container');
    const bookingDetailsModal = new bootstrap.Modal(document.getElementById('bookingDetailsModal'));

    // --- MAIN FUNCTION TO RENDER ALL BOOKINGS ---
    function renderBookings() {
        // Clear existing content
        newRequestsContainer.innerHTML = '';
        ongoingJobsContainer.innerHTML = '';

        let newRequestsCount = 0;

        allBookings.forEach(job => {
            if (job.status === 'new') {
                newRequestsContainer.innerHTML += createBookingCard(job);
                newRequestsCount++;
            } else if (job.status === 'ongoing') {
                ongoingJobsContainer.innerHTML += createBookingCard(job);
            }
        });
        
        document.getElementById('new-requests-count').textContent = newRequestsCount;
        attachCardListeners();
    }

    // --- FUNCTION TO CREATE A SINGLE BOOKING CARD (HTML) ---
    function createBookingCard(job) {
        const cardClass = job.status === 'ongoing' ? 'ongoing' : '';
        return `
            <div class="card booking-card shadow-sm mb-3 ${cardClass}" data-booking-id="${job.id}">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="customer-name mb-1">${job.customer}</h5>
                        <p class="service-name mb-2">${job.service}</p>
                        <div class="info-item mb-1"><i class="fas fa-clock me-2"></i><span>${job.time}</span></div>
                        <div class="info-item"><i class="fas fa-map-marker-alt me-2"></i><span>${job.location}</span></div>
                    </div>
                    <div class="text-end">
                        <div class="earning-tag">₹${job.earnings}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- ATTACH CLICK LISTENERS TO CARDS ---
    function attachCardListeners() {
        document.querySelectorAll('.booking-card').forEach(card => {
            card.addEventListener('click', () => {
                const bookingId = parseInt(card.dataset.bookingId);
                const job = allBookings.find(b => b.id === bookingId);
                showBookingDetails(job);
            });
        });
    }

    // --- FUNCTION TO SHOW DETAILS IN THE MODAL ---
    function showBookingDetails(job) {
        const modalBody = document.getElementById('modal-body-content');
        const modalFooter = document.getElementById('modal-footer-actions');

        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-7">
                    <h4>${job.service}</h4>
                    <p><strong>Customer:</strong> ${job.customer}</p>
                    <p><strong>Time:</strong> ${job.time}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Est. Earning:</strong> <span class="fw-bold text-success">₹${job.earnings}</span></p>
                    ${job.notes ? `<p><strong>Notes:</strong> <span class="text-muted fst-italic">"${job.notes}"</span></p>` : ''}
                </div>
                <div class="col-md-5">
                    <h6>Job Location</h6>
                    <div class="map-placeholder">
                        <i class="fas fa-map-marked-alt me-2"></i> Google Map Preview
                    </div>
                </div>
            </div>
        `;

        // Add action buttons based on status
        if (job.status === 'new') {
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-outline-danger" onclick="handleBookingAction(${job.id}, 'reject')">Reject Booking</button>
                <button type="button" class="btn btn-success btn-lg" onclick="handleBookingAction(${job.id}, 'accept')"><i class="fas fa-check me-2"></i>Accept Booking</button>
            `;
        } else if (job.status === 'ongoing') {
             modalFooter.innerHTML = `
                <button type="button" class="btn btn-primary btn-lg"><i class="fas fa-flag-checkered me-2"></i>Mark as Complete</button>
             `;
        }
        
        bookingDetailsModal.show();
    }
    
    // --- GLOBAL FUNCTION TO HANDLE ACTIONS (Accept/Reject) ---
    // Note: Making this global so the inline `onclick` can access it.
    window.handleBookingAction = function(bookingId, action) {
        const jobIndex = allBookings.findIndex(b => b.id === bookingId);
        if (jobIndex === -1) return;

        // Show a loading spinner on the button
        const actionBtn = event.target;
        actionBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
        actionBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            if (action === 'accept') {
                allBookings[jobIndex].status = 'ongoing';
                showToast('Booking Accepted!', `Job for ${allBookings[jobIndex].customer} has been added to your ongoing list.`, 'success');
            } else if (action === 'reject') {
                // Remove the job from the list
                allBookings.splice(jobIndex, 1);
                showToast('Booking Rejected', 'The booking has been removed from your list.', 'danger');
            }
            
            bookingDetailsModal.hide();
            renderBookings(); // Re-render the dashboard to reflect changes
        }, 1000); // 1-second delay to simulate network
    }

    // --- FUNCTION TO SHOW TOAST NOTIFICATION ---
    function showToast(title, message, type) {
        const toastEl = document.getElementById('actionToast');
        const toast = new bootstrap.Toast(toastEl);
        
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-body').textContent = message;

        // Reset classes and add new one for color
        toastEl.classList.remove('bg-success', 'bg-danger', 'text-white');
        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'danger') {
            toastEl.classList.add('bg-danger', 'text-white');
        }
        
        toast.show();
    }

    // Initial setup
    document.getElementById("menu-toggle").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("wrapper").classList.toggle("toggled");
    });

    renderBookings(); // Initial render when the page loads
});