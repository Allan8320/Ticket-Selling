const API_URL = '/api';

// DOM Elements
const ticketsList = document.getElementById('ticketsList');
const resellForm = document.getElementById('resellForm');
const submitResellBtn = document.getElementById('submitResellBtn');

// Load tickets on start
document.addEventListener('DOMContentLoaded', fetchTickets);

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');

    toast.className = `toast ${type}`;
    toastIcon.innerHTML = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
    toastMessage.textContent = message;

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// Handle Form Submission
resellForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Loading state
    const originalBtnText = submitResellBtn.innerHTML;
    submitResellBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    submitResellBtn.disabled = true;

    // Gather multiple fields
    const payload = {
        sellerName: document.getElementById('sellerName').value,
        eventName: document.getElementById('eventName').value,
        eventDate: document.getElementById('eventDate').value,
        location: document.getElementById('location').value,
        ticketType: document.getElementById('ticketType').value,
        price: document.getElementById('price').value
    };

    try {
        const response = await fetch(`${API_URL}/resell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast('Ticket published successfully to marketplace!');
            resellForm.reset();
            fetchTickets(); // Refresh List
        } else {
            const err = await response.json();
            showToast(`Error: ${err.message}`, 'error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showToast('Server connection failed.', 'error');
    } finally {
        // Reset UI
        submitResellBtn.innerHTML = originalBtnText;
        submitResellBtn.disabled = false;
    }
});

// Fetch and Render Tickets
async function fetchTickets() {
    try {
        const response = await fetch(`${API_URL}/tickets`);
        const tickets = await response.json();
        
        ticketsList.innerHTML = ''; 
        
        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
                    <i class="fa-solid fa-ticket fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No tickets found in the marketplace.</h3>
                    <p>Be the first to list a ticket!</p>
                </div>`;
            return;
        }

        tickets.forEach(ticket => {
            const isBooked = ticket.status === 'booked';
            
            // Format Data
            const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            // Build Card HTML
            const card = document.createElement('div');
            card.className = 'ticket-card';
            
            card.innerHTML = `
                <div class="ticket-status ${isBooked ? 'status-booked' : 'status-available'}">
                    ${isBooked ? 'Sold Out' : 'Available'}
                </div>
                
                <div class="ticket-date">
                    <i class="fa-regular fa-calendar-check"></i> ${ticket.eventDate ? formattedDate : 'Date TBA'}
                </div>
                
                <h3>${ticket.eventName}</h3>
                
                <div class="ticket-meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${ticket.location || 'Location TBA'}</span>
                    <span><i class="fa-solid fa-layer-group"></i> ${ticket.ticketType || 'Standard'}</span>
                    <span><i class="fa-regular fa-user"></i> Listed by: ${ticket.sellerName || 'Anonymous'}</span>
                </div>
                
                <div class="ticket-footer">
                    <div class="ticket-price">₹${ticket.price}</div>
                    <button 
                        class="btn btn-book" 
                        onclick="bookTicket(${ticket.id})" 
                        ${isBooked ? 'disabled' : ''}>
                        ${isBooked ? 'Unavailable' : 'Secure Now'}
                    </button>
                </div>
            `;
            
            // Small stagger animation effect
            card.style.animation = `fadeUp 0.5s ease forwards`;
            ticketsList.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load tickets:', error);
        ticketsList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--accent); padding: 40px;">
                <i class="fa-solid fa-triangle-exclamation fa-3x" style="margin-bottom: 20px;"></i>
                <h3>Could not connect to backend server.</h3>
                <p>Ensure Node.js is running.</p>
            </div>`;
    }
}

// Book a ticket API call
async function bookTicket(id) {
    if (!confirm('Proceed to checkout and reserve this ticket?')) return;

    try {
        const response = await fetch(`${API_URL}/book/${id}`, {
            method: 'POST'
        });

        if (response.ok) {
            showToast('Ticket secured successfully! Check your email.');
            fetchTickets(); // Refresh List to show it as Booked
        } else {
            const err = await response.json();
            showToast(`Error: ${err.message}`, 'error');
        }
    } catch (error) {
        console.error('Booking failed:', error);
        showToast('Transaction failed due to server error.', 'error');
    }
}

// Add simple CSS animation dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
