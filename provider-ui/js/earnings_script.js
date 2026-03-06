


document.addEventListener("DOMContentLoaded", function() {

    // --- FAKE DATA (Simulating a larger, more varied dataset from an API) ---
    const allTransactions = [
        { id: 101, customer: "Vikram Das", date: "2025-05-23", service: "AC Service", amount: 499, status: "Paid" },
        { id: 102, customer: "Anjali Mehta", date: "2025-05-22", service: "Plumbing Work", amount: 1250, status: "Paid" },
        { id: 103, customer: "Sameer Patil", date: "2025-05-21", service: "Fan Installation", amount: 799, status: "Pending" },
        { id: 104, customer: "Priya Singh", date: "2025-05-18", service: "Tap Repair", amount: 349, status: "Paid" },
        { id: 105, customer: "Rohan Sharma", date: "2025-05-15", service: "Switch Repair", amount: 299, status: "Failed" },
        { id: 106, customer: "Sunita Reddy", date: "2025-05-12", service: "House Painting", amount: 8500, status: "Paid" },
        { id: 107, customer: "Amit Kumar", date: "2025-05-05", service: "AC Repair", amount: 2500, status: "Paid" },
        { id: 108, customer: "Nisha Gupta", date: "2025-04-28", service: "Cleaning", amount: 1500, status: "Paid" },
        { id: 109, customer: "Karan Verma", date: "2025-04-25", service: "Carpentry", amount: 3200, status: "Paid" },
        { id: 110, customer: "Sonia Rao", date: "2025-04-20", service: "Electrical Work", amount: 950, status: "Paid" },
        { id: 111, customer: "Rajesh Singh", date: "2025-04-15", service: "AC Service", amount: 499, status: "Paid" },
        { id: 112, customer: "Deepika Iyer", date: "2025-04-10", service: "Plumbing", amount: 1800, status: "Pending" },
        { id: 113, customer: "Mohit Agarwal", date: "2025-04-05", service: "Cleaning", amount: 2000, status: "Paid" },
    ];
    
    // --- STATE MANAGEMENT ---
    let state = {
        transactions: allTransactions,
        currentPage: 1,
        rowsPerPage: 7,
        filters: { search: '', status: 'all', startDate: '', endDate: '' }
    };

    // --- UI ELEMENTS ---
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    let earningsChart = null; 

    // --- CORE LOGIC ---
    function applyFilters() {
        state.filters.search = searchInput.value.toLowerCase();
        state.filters.status = statusFilter.value;
        state.filters.startDate = startDateInput.value;
        state.filters.endDate = endDateInput.value;

        let filtered = allTransactions.filter(t => {
            const searchMatch = t.customer.toLowerCase().includes(state.filters.search) || t.id.toString().includes(state.filters.search);
            const statusMatch = state.filters.status === 'all' || t.status === state.filters.status;
            const date = new Date(t.date);
            const startDateMatch = !state.filters.startDate || date >= new Date(state.filters.startDate);
            const endDateMatch = !state.filters.endDate || date <= new Date(state.filters.endDate);
            return searchMatch && statusMatch && startDateMatch && endDateMatch;
        });

        state.transactions = filtered;
        state.currentPage = 1; 
        updateDisplay();
    }

    function updateDisplay() {
        renderTransactionTable();
        renderPagination();
        renderSummaryCards(state.transactions);
        renderEarningsChart(state.transactions);
    }
    
    // --- RENDER FUNCTIONS ---
    function renderTransactionTable() {
        const tableBody = document.getElementById('transactions-table-body');
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
        
        setTimeout(() => {
            tableBody.innerHTML = '';
            const start = (state.currentPage - 1) * state.rowsPerPage;
            const end = start + state.rowsPerPage;
            const paginatedItems = state.transactions.slice(start, end);

            if (paginatedItems.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No transactions match your criteria.</td></tr>';
                return;
            }

            paginatedItems.forEach(t => {
                let statusBadge;
                switch(t.status.toLowerCase()) {
                    case 'paid': statusBadge = 'bg-success'; break;
                    case 'pending': statusBadge = 'bg-warning text-dark'; break;
                    case 'failed': statusBadge = 'bg-danger'; break;
                    default: statusBadge = 'bg-secondary';
                }
                tableBody.innerHTML += `<tr><th scope="row">#${t.id}</th><td>${t.customer}</td><td>${new Date(t.date).toLocaleDateString('en-GB')}</td><td>${t.service}</td><td>₹${t.amount.toLocaleString('en-IN')}</td><td><span class="badge ${statusBadge}">${t.status}</span></td></tr>`;
            });
        }, 300);
    }

    function renderPagination() {
        const controls = document.getElementById('pagination-controls');
        const info = document.getElementById('pagination-info');
        controls.innerHTML = '';
        const totalPages = Math.ceil(state.transactions.length / state.rowsPerPage);
        
        if (totalPages <= 1) {
            info.textContent = state.transactions.length > 0 ? `Showing ${state.transactions.length} results` : '';
            return;
        }

        let paginationHTML = '<ul class="pagination pagination-sm mb-0">';
        paginationHTML += `<li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${state.currentPage - 1}">Previous</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<li class="page-item ${i === state.currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        paginationHTML += `<li class="page-item ${state.currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${state.currentPage + 1}">Next</a></li>`;
        paginationHTML += '</ul>';
        controls.innerHTML = paginationHTML;

        const start = (state.currentPage - 1) * state.rowsPerPage + 1;
        const end = Math.min(start + state.rowsPerPage - 1, state.transactions.length);
        info.textContent = `Showing ${start}-${end} of ${state.transactions.length} results`;
    }

    function renderSummaryCards(transactions) {
        const totalEarnings = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
        const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
        const upcomingPayout = totalEarnings * 0.3; // Demo calculation

        const container = document.getElementById('summary-cards-container');
        container.innerHTML = `
            <div class="col-md-4"><div class="card summary-card shadow-sm h-100"><div class="card-body d-flex align-items-center"><div class="summary-card-icon bg-success text-white"><i class="fas fa-check-circle"></i></div><div class="ms-3"><p class="text-muted mb-0">Total Paid Earnings</p><h2 class="fw-bold mb-0">₹${totalEarnings.toLocaleString('en-IN')}</h2></div></div></div></div>
            <div class="col-md-4"><div class="card summary-card shadow-sm h-100"><div class="card-body d-flex align-items-center"><div class="summary-card-icon bg-warning text-dark"><i class="fas fa-hourglass-half"></i></div><div class="ms-3"><p class="text-muted mb-0">Pending Amount</p><h2 class="fw-bold mb-0">₹${pendingAmount.toLocaleString('en-IN')}</h2></div></div></div></div>
            <div class="col-md-4"><div class="card summary-card shadow-sm h-100"><div class="card-body d-flex align-items-center"><div class="summary-card-icon bg-info text-white"><i class="fas fa-university"></i></div><div class="ms-3"><p class="text-muted mb-0">Est. Upcoming Payout</p><h2 class="fw-bold mb-0">₹${upcomingPayout.toLocaleString('en-IN')}</h2></div></div></div></div>
        `;
    }

    function renderEarningsChart(transactions) {
        if (earningsChart) {
            earningsChart.destroy();
        }

        const dailyData = {};
        transactions.filter(t => t.status === 'Paid').forEach(t => {
            const date = t.date;
            dailyData[date] = (dailyData[date] || 0) + t.amount;
        });
        
        const sortedDays = Object.keys(dailyData).sort();
        const chartLabels = sortedDays.map(day => new Date(day).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'}));
        const chartData = sortedDays.map(day => dailyData[day]);
        
        const ctx = document.getElementById('earningsChart').getContext('2d');
        earningsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Daily Earnings (₹)',
                    data: chartData,
                    backgroundColor: 'rgba(13, 110, 253, 0.6)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => '₹' + value.toLocaleString('en-IN') }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => ` Earnings: ₹${context.raw.toLocaleString('en-IN')}`
                        }
                    }
                }
            }
        });
    }

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    startDateInput.addEventListener('change', applyFilters);
    endDateInput.addEventListener('change', applyFilters);

    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        startDateInput.value = '';
        endDateInput.value = '';
        applyFilters();
    });

    document.getElementById('pagination-controls').addEventListener('click', e => {
        e.preventDefault();
        if (e.target.tagName === 'A' && e.target.dataset.page) {
            const page = parseInt(e.target.dataset.page);
            if (page !== state.currentPage && !e.target.parentElement.classList.contains('disabled')) {
                state.currentPage = page;
                renderTransactionTable();
                renderPagination();
            }
        }
    });

    exportCsvBtn.addEventListener('click', () => {
        const headers = ["Job ID", "Customer", "Date", "Service", "Amount", "Status"];
        const csvRows = [headers.join(',')];
        state.transactions.forEach(t => {
            const row = [t.id, `"${t.customer}"`, t.date, `"${t.service}"`, t.amount, t.status];
            csvRows.push(row.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'filtered_transactions.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    document.getElementById("menu-toggle").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("wrapper").classList.toggle("toggled");
    });
    
    // --- INITIALIZE ---
    updateDisplay();
});