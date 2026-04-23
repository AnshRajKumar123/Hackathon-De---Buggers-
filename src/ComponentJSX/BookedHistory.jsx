import React, { useState, useEffect } from 'react';
import '../ComponentCSS/BookCenter.css';
import '../ComponentCSS/BookedHistory.css'

const BookedHistory = () => {
    const [history, setHistory] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const savedHistory = localStorage.getItem('parkingHistory');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            const sorted = parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setHistory(sorted);
        }
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedTicket]);

    const getTicketStatus = (ticket) => {
        if (ticket.status === 'Cancelled') return 'Cancelled';

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const currentDate = `${yyyy}-${mm}-${dd}`;
        const currentTime = now.toTimeString().substring(0, 5);

        if (ticket.date < currentDate || (ticket.date === currentDate && ticket.outTime <= currentTime)) {
            return 'Completed';
        }
        return 'Upcoming';
    };

    const handleCancelBooking = (bookingIdToCancel) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this booking? The slots will be released.");
        if (!isConfirmed) return;

        const bookingToCancel = history.find(b => b.bookingId === bookingIdToCancel);
        if (!bookingToCancel) return;
        const slotsToFree = bookingToCancel.slots;

        const updatedHistory = history.map(b =>
            b.bookingId === bookingIdToCancel ? { ...b, status: 'Cancelled' } : b
        );

        setHistory(updatedHistory);
        localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));

        const savedBookedSlots = JSON.parse(localStorage.getItem('bookedParkingSlots')) || [];
        const updatedBookedSlots = savedBookedSlots.filter(slotId => !slotsToFree.includes(slotId));
        localStorage.setItem('bookedParkingSlots', JSON.stringify(updatedBookedSlots));

        alert("Booking cancelled successfully. Slots are now available.");
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const filteredHistory = history.filter(ticket => {
        if (activeTab === 'All') return true;
        return getTicketStatus(ticket) === activeTab;
    });

    const getBadgeStyle = (status) => {
        switch (status) {
            case 'Upcoming': return { bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9' };
            case 'Completed': return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0' };
            case 'Cancelled': return { bg: '#ffebee', color: '#c62828', border: '#ffcdd2' };
            default: return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0' };
        }
    };

    return (
        <div className='BookCenter_Section'>
            <h1 id='Booker_Heading'>Your Booking History</h1>
            <p className="SelectedLocText BookedHisPara">View your active and past parking tickets.</p>

            {/* Navigation Tabs */}
            <div className="HistoryTabsContainer">
                {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`HistoryTabBtn ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {filteredHistory.length === 0 ? (
                /* Empty State */
                <div className="HistoryEmptyState">
                    <h3>No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} bookings found.</h3>
                    <p>When you book a parking slot, your digital tickets will appear here.</p>
                </div>
            ) : (
                /* History List */
                <div className="HistoryListContainer">
                    {filteredHistory.map((booking, index) => {
                        const status = getTicketStatus(booking);
                        const badgeStyle = getBadgeStyle(status);

                        return (
                            <div key={index} className="HistoryCard">

                                <div
                                    className="StatusBadge CardBadge"
                                    style={{ background: badgeStyle.bg, color: badgeStyle.color, borderColor: badgeStyle.border }}
                                >
                                    {status}
                                </div>

                                <div className="HistoryCardContent">
                                    <h3 className="HistoryCardDate">{booking.date}</h3>
                                    <p className="HistoryCardBookedOn">Booked on: {formatDate(booking.timestamp)}</p>
                                    <p className="HistoryCardDetails">
                                        <strong>ID:</strong> {booking.bookingId} &nbsp;|&nbsp; <strong>Slots:</strong> {booking.slots.join(', ')}
                                    </p>
                                    <p className="HistoryCardSubDetails">
                                        🕒 {booking.inTime} - {booking.outTime} &nbsp;|&nbsp; 🚗 Vehicle: <strong>{booking.plateNumber}</strong>
                                    </p>
                                </div>

                                <div className="HistoryCardActions">
                                    {status === 'Upcoming' && (
                                        <button className="CancelTicketBtn" onClick={() => handleCancelBooking(booking.bookingId)}>
                                            Cancel Ticket
                                        </button>
                                    )}

                                    <button className="ConfirmBtn ViewTicketBtn" onClick={() => setSelectedTicket(booking)}>
                                        View Ticket
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reused Ticket Modal for viewing history */}
            {selectedTicket && (
                <div className="ModalOverlay" onClick={() => setSelectedTicket(null)}>
                    <div className="ModalContent TicketContent RelativeModal" onClick={(e) => e.stopPropagation()}>

                        <div
                            className="StatusBadge ModalBadge"
                            style={{
                                background: getBadgeStyle(getTicketStatus(selectedTicket)).bg,
                                color: getBadgeStyle(getTicketStatus(selectedTicket)).color,
                                borderColor: getBadgeStyle(getTicketStatus(selectedTicket)).border
                            }}
                        >
                            {getTicketStatus(selectedTicket)}
                        </div>

                        <div className="TicketHeader">
                            <h2>Parking Ticket</h2>
                            <p>Show this QR at the gate.</p>
                        </div>

                        <div className="TicketBody">
                            <div className="TicketQRContainer">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedTicket.bookingId)}`}
                                    alt="Access QR Code"
                                    className={getTicketStatus(selectedTicket) === 'Cancelled' ? 'FadedQR' : ''}
                                />
                                <h3 className={getTicketStatus(selectedTicket) === 'Cancelled' ? 'StrikeText' : ''}>
                                    {selectedTicket.bookingId}
                                </h3>
                            </div>

                            <div className="TicketDetails">
                                <div className="DetailRow"><span>Name:</span> <strong>{selectedTicket.name}</strong></div>
                                <div className="DetailRow"><span>Date:</span> <strong>{selectedTicket.date}</strong></div>
                                <div className="DetailRow"><span>Time:</span> <strong>{selectedTicket.inTime} to {selectedTicket.outTime}</strong></div>
                                <div className="DetailRow"><span>Slots:</span> <strong>{selectedTicket.slots.join(', ')}</strong></div>
                                <div className="DetailRow"><span>Vehicle:</span> <strong>{selectedTicket.plateNumber}</strong></div>
                                <div className="DetailRow AmountPaidRow">
                                    <span>Amount Paid:</span> <strong className="AmountPaidValue">₹{selectedTicket.amount}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="ModalActions CenteredModalActions">
                            <button className="CancelBtn" onClick={() => setSelectedTicket(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookedHistory;