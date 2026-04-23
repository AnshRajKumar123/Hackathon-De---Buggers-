import React, { useState, useEffect } from 'react';
import '../ComponentCSS/BookCenter.css';

const BookedHistory = () => {
    const [history, setHistory] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Load history from Local Storage when the page loads
    useEffect(() => {
        const savedHistory = localStorage.getItem('parkingHistory');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            // Sort by timestamp so the newest bookings appear at the top
            const sorted = parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setHistory(sorted);
        }
    }, []);

    // Prevent background scrolling when the ticket modal is open
    useEffect(() => {
        if (selectedTicket) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedTicket]);

    // --- NEW: Cancel Booking Function ---
    const handleCancelBooking = (bookingIdToCancel) => {
        // 1. Ask for confirmation first
        const isConfirmed = window.confirm("Are you sure you want to cancel this booking? The slots will be released.");
        if (!isConfirmed) return;

        // 2. Find the booking to get the slots we need to free up
        const bookingToCancel = history.find(b => b.bookingId === bookingIdToCancel);
        if (!bookingToCancel) return;
        const slotsToFree = bookingToCancel.slots;

        // 3. Remove from History State & LocalStorage
        const updatedHistory = history.filter(b => b.bookingId !== bookingIdToCancel);
        setHistory(updatedHistory);
        localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));

        // 4. Free up the slots in bookedParkingSlots LocalStorage
        const savedBookedSlots = JSON.parse(localStorage.getItem('bookedParkingSlots')) || [];
        const updatedBookedSlots = savedBookedSlots.filter(slotId => !slotsToFree.includes(slotId));
        localStorage.setItem('bookedParkingSlots', JSON.stringify(updatedBookedSlots));

        // Optional: You could add a toast notification here if you import your Toast component!
        alert("Booking cancelled successfully. Slots are now available.");
    };

    // Format the timestamp to look clean (e.g., "Mar 29, 2026")
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className='BookCenter_Section'>
            <h1 id='Booker_Heading'>Your Booking History</h1>
            <p className="SelectedLocText BookedHisPara">View your active and past parking tickets.</p>

            {history.length === 0 ? (
                // --- Empty State ---
                <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: '#f9f9f9', borderRadius: '15px' }}>
                    <h3 style={{ color: '#555', marginBottom: '10px' }}>No bookings found yet.</h3>
                    <p style={{ color: '#888' }}>When you book a parking slot, your digital tickets will appear here.</p>
                </div>
            ) : (
                // --- History List ---
                <div className="HistoryList" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px', margin: '0 auto', marginTop: '30px' }}>
                    {history.map((booking, index) => (
                        <div key={index} style={{
                            background: '#fff',
                            padding: '20px 25px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '15px'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', color: 'var(--primary-color)', fontSize: '1.4rem' }}>
                                    {booking.date}
                                </h3>
                                {/* NEW: Showing the date the booking was actually made */}
                                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#999' }}>
                                    Booked on: {formatDate(booking.timestamp)}
                                </p>
                                <p style={{ margin: '0 0 8px 0', color: '#444', fontSize: '1rem' }}>
                                    <strong>ID:</strong> {booking.bookingId} &nbsp;|&nbsp; <strong>Slots:</strong> {booking.slots.join(', ')}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#777' }}>
                                    🕒 {booking.inTime} - {booking.outTime} &nbsp;|&nbsp; 🚗 Vehicle: <strong>{booking.plateNumber}</strong>
                                </p>
                            </div>

                            {/* Action Buttons Container */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {/* NEW: Cancel Button */}
                                <button
                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--danger-color)',
                                        border: '1px solid var(--danger-color)',
                                        padding: '10px 15px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = '#ffebeb';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'transparent';
                                    }}
                                >
                                    Cancel Ticket
                                </button>

                                <button
                                    className="ConfirmBtn"
                                    style={{ padding: '10px 25px', fontSize: '1rem', whiteSpace: 'nowrap' }}
                                    onClick={() => setSelectedTicket(booking)}
                                >
                                    View Ticket
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Reused Ticket Modal for viewing history --- */}
            {selectedTicket && (
                <div className="ModalOverlay" onClick={() => setSelectedTicket(null)}>
                    <div className="ModalContent TicketContent" onClick={(e) => e.stopPropagation()}>
                        <div className="TicketHeader">
                            <h2>Parking Ticket</h2>
                            <p>Show this QR at the gate.</p>
                        </div>

                        <div className="TicketBody">
                            <div className="TicketQRContainer">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedTicket.bookingId)}`}
                                    alt="Access QR Code"
                                />
                                <h3>{selectedTicket.bookingId}</h3>
                            </div>

                            <div className="TicketDetails">
                                <div className="DetailRow"><span>Name:</span> <strong>{selectedTicket.name}</strong></div>
                                <div className="DetailRow"><span>Date:</span> <strong>{selectedTicket.date}</strong></div>
                                <div className="DetailRow"><span>Time:</span> <strong>{selectedTicket.inTime} to {selectedTicket.outTime}</strong></div>
                                <div className="DetailRow"><span>Slots:</span> <strong>{selectedTicket.slots.join(', ')}</strong></div>
                                <div className="DetailRow"><span>Vehicle:</span> <strong>{selectedTicket.plateNumber}</strong></div>
                                <div className="DetailRow" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #eee' }}>
                                    <span>Amount Paid:</span> <strong style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>₹{selectedTicket.amount}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="ModalActions" style={{ justifyContent: 'center', marginTop: '10px', paddingBottom: '20px' }}>
                            <button className="CancelBtn" onClick={() => setSelectedTicket(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookedHistory;