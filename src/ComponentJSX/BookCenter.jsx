import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../ComponentCSS/BookCenter.css';
import { ImageCenter } from '../assets/assest'

const BookCenter = () => {
    const location = useLocation();
    const { selectedAddress } = location.state || {};

    const [activeSection, setActiveSection] = useState("A1");
    const [selectedSlots, setSelectedSlots] = useState([]);

    const [bookedSlots, setBookedSlots] = useState(() => {
        const savedBookings = localStorage.getItem('bookedParkingSlots');
        return savedBookings ? JSON.parse(savedBookings) : [];
    });

    // --- Modal States ---
    const [showModal, setShowModal] = useState(false);             // Step 1: Details
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Step 2: Payment
    const [showTicketModal, setShowTicketModal] = useState(false);   // Step 3: Success
    const [currentTicket, setCurrentTicket] = useState(null);

    // Initialize form with saved profile if it exists
    const [formData, setFormData] = useState(() => {
        const savedProfile = localStorage.getItem('userParkingProfile');
        const profile = savedProfile ? JSON.parse(savedProfile) : {};
        return {
            name: profile.name || '',
            phone: profile.phone || '',
            carModel: profile.carModel || '',
            plateNumber: profile.plateNumber || '',
            bookingDate: '',
            inTime: '',
            outTime: ''
        };
    });

    const [formErrors, setFormErrors] = useState({});

    // Prevent body scrolling when any modal is open
    useEffect(() => {
        if (showModal || showPaymentModal || showTicketModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal, showPaymentModal, showTicketModal]);

    // Calculate Min/Max Dates (Today to +7 days)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date(today);
    maxDateObj.setDate(today.getDate() + 7);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    // Sections array with custom slot totals
    const sections = [
        { id: "A1", total: 60 }, { id: "A2", total: 50 }, { id: "A3", total: 65 },
        { id: "B1", total: 70 }, { id: "B2", total: 50 }, { id: "B3", total: 45 },
        { id: "C1", total: 30 }, { id: "C2", total: 40 }, { id: "C3", total: 60 },
    ];

    const currentSectionData = sections.find(sec => sec.id === activeSection);
    const totalSlotsForActiveSection = currentSectionData ? currentSectionData.total : 60;

    // Generate dynamic slots
    const slots = Array.from({ length: totalSlotsForActiveSection }, (_, i) => {
        const slotNumber = i + 1;
        const formattedNumber = slotNumber < 10 ? `0${slotNumber}` : slotNumber;

        let category = "Basic";
        let price = 35;

        if (slotNumber <= Math.ceil(totalSlotsForActiveSection * 0.15)) {
            category = "Premium";
            price = 70;
        } else if (slotNumber <= Math.ceil(totalSlotsForActiveSection * 0.45)) {
            category = "Standard";
            price = 50;
        }

        return {
            id: `${activeSection}-${formattedNumber}`,
            label: `${activeSection}-${formattedNumber}`,
            category: category,
            price: price
        };
    });

    // Dynamic Column Generation
    const columns = [];
    const slotsPerColumn = Math.ceil(totalSlotsForActiveSection / 5);

    for (let i = 0; i < 5; i++) {
        columns.push(slots.slice(i * slotsPerColumn, (i + 1) * slotsPerColumn));
    }

    const handleSectionChange = (secId) => {
        setActiveSection(secId);
        setSelectedSlots([]);
    };

    const handleSlotClick = (slotId) => {
        if (bookedSlots.includes(slotId)) return;
        setSelectedSlots((prev) => prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]);
    };

    const totalPrice = selectedSlots.reduce((sum, slotId) => {
        const slot = slots.find(s => s.id === slotId);
        return sum + (slot ? slot.price : 0);
    }, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
        } else if (name === 'plateNumber') {
            setFormData({ ...formData, [name]: value.toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.name.trim()) errors.name = "Required";
        if (formData.phone.length !== 10) errors.phone = "10 digits required";
        if (!formData.carModel.trim()) errors.carModel = "Required";
        const plateRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/;
        if (!plateRegex.test(formData.plateNumber)) errors.plateNumber = "Invalid format";
        if (!formData.bookingDate) errors.bookingDate = "Required";
        if (!formData.inTime) errors.inTime = "Required";
        if (!formData.outTime) errors.outTime = "Required";
        if (formData.inTime && formData.outTime && formData.inTime >= formData.outTime) errors.outTime = "Must be after In-time";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const generateBookingID = () => {
        return 'PRK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    };

    // STEP 1: Proceed from Details to Payment
    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(false);
            setShowPaymentModal(true);
        }
    };

    // STEP 2: Finalize Booking after Payment
    const handleFinalBooking = () => {
        // 1. Save booked slots
        const newBookedSlots = [...bookedSlots, ...selectedSlots];
        setBookedSlots(newBookedSlots);
        localStorage.setItem('bookedParkingSlots', JSON.stringify(newBookedSlots));

        // 2. Save User Profile for next time
        localStorage.setItem('userParkingProfile', JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            carModel: formData.carModel,
            plateNumber: formData.plateNumber
        }));

        // 3. Create Ticket Data
        const ticketData = {
            bookingId: generateBookingID(),
            name: formData.name,
            date: formData.bookingDate,
            inTime: formData.inTime,
            outTime: formData.outTime,
            slots: selectedSlots,
            plateNumber: formData.plateNumber,
            amount: totalPrice,
            timestamp: new Date().toISOString()
        };

        // 4. Save to History
        const existingHistory = JSON.parse(localStorage.getItem('parkingHistory')) || [];
        localStorage.setItem('parkingHistory', JSON.stringify([...existingHistory, ticketData]));

        // 5. Update UI state
        setCurrentTicket(ticketData);
        setShowPaymentModal(false);
        setShowTicketModal(true);

        // 6. Reset form dates and slots
        setSelectedSlots([]);
        setFormData(prev => ({ ...prev, bookingDate: '', inTime: '', outTime: '' }));
    };

    const filledInActiveSection = bookedSlots.filter(id => id.startsWith(activeSection)).length;

    return (
        <div className='BookCenter_Section'>
            <h1 id='Booker_Heading'>Book Your Parking Spot</h1>
            <p className="SelectedLocText">📍 {selectedAddress || "No location selected"}</p>

            <div className="Slider_Of_ParkingSect">
                {sections.map((sec) => (
                    <div
                        key={sec.id}
                        className={`BoxAlpha ${bookedSlots.filter(id => id.startsWith(sec.id)).length >= sec.total ? 'full' : ''} ${activeSection === sec.id ? 'active' : ''}`}
                        onClick={() => !(bookedSlots.filter(id => id.startsWith(sec.id)).length >= sec.total) && handleSectionChange(sec.id)}
                    >
                        {sec.id}
                    </div>
                ))}
            </div>

            <div className="SectionDetails">
                <div className="SectionHeader">
                    <h2>Section {activeSection}</h2>
                    <p>Available Slots: {totalSlotsForActiveSection - filledInActiveSection} / {totalSlotsForActiveSection}</p>
                </div>

                <div className="ParkingMapContainer">
                    {columns.map((col, index) => (
                        <React.Fragment key={index}>
                            <div className="ParkingColumn">
                                {col.map((slot) => {
                                    const isBooked = bookedSlots.includes(slot.id);
                                    const isSelected = selectedSlots.includes(slot.id);
                                    return (
                                        <div
                                            key={slot.id}
                                            className={`ParkingSlot ${isBooked ? 'booked-slot' : ''} ${isSelected && !isBooked ? 'selected-slot' : ''}`}
                                            onClick={() => handleSlotClick(slot.id)}
                                        >
                                            {isBooked && <span className="icon car-icon">🚗</span>}
                                            <span className="SlotNum">{slot.label}</span>
                                            <span className="SlotCategory">{slot.category}</span>
                                            <span className="SlotPrice">₹{slot.price}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {index < 4 && <div className="ParkingRoad"><div className="RoadLine"></div></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="BookingActions">
                    <button className="ConfirmBtn" disabled={selectedSlots.length === 0} onClick={() => setShowModal(true)}>
                        {selectedSlots.length > 0 ? `Confirm Booking (${selectedSlots.length}) - ₹${totalPrice}` : 'Select Slots'}
                    </button>
                </div>
            </div>

            {/* --- Modal 1: Detail Section --- */}
            {showModal && (
                <div className="ModalOverlay">
                    <div className="ModalContent">
                        <h2>Detail Section</h2>
                        <p className="ModalSubText">Selected Slots: {selectedSlots.join(', ')}</p>

                        <form onSubmit={handleProceedToPayment} className="BookingForm">
                            <div className="FormGroup">
                                <label>1. Owner Name</label>
                                <input type="text" name="name" value={formData.name} placeholder='Your Name' onChange={handleInputChange} />
                                {formErrors.name && <span className="ErrorText">{formErrors.name}</span>}
                            </div>
                            <div className="FormGroup">
                                <label>2. Owner Number</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10 digits" />
                                {formErrors.phone && <span className="ErrorText">{formErrors.phone}</span>}
                            </div>
                            <div className="FormGroup">
                                <label>3. Car Model</label>
                                <input type="text" name="carModel" value={formData.carModel} placeholder='ex:- Bolero Neo' onChange={handleInputChange} />
                                {formErrors.carModel && <span className="ErrorText">{formErrors.carModel}</span>}
                            </div>
                            <div className="FormGroup">
                                <label>4. Number Plate</label>
                                <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleInputChange} placeholder="MH 12 AB 1234" />
                                {formErrors.plateNumber && <span className="ErrorText">{formErrors.plateNumber}</span>}
                            </div>
                            <div className="FormRow">
                                <div className="FormGroup half">
                                    <label>5. Date</label>
                                    <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} min={minDate} max={maxDate} />
                                    {formErrors.bookingDate && <span className="ErrorText">{formErrors.bookingDate}</span>}
                                </div>
                            </div>
                            <div className="FormRow">
                                <div className="FormGroup half">
                                    <label>6a. In-Time</label>
                                    <input type="time" name="inTime" value={formData.inTime} onChange={handleInputChange} />
                                    {formErrors.inTime && <span className="ErrorText">{formErrors.inTime}</span>}
                                </div>
                                <div className="FormGroup half">
                                    <label>6b. Out-Time</label>
                                    <input type="time" name="outTime" value={formData.outTime} onChange={handleInputChange} />
                                    {formErrors.outTime && <span className="ErrorText">{formErrors.outTime}</span>}
                                </div>
                            </div>

                            <div className="ModalActions">
                                <button type="button" className="CancelBtn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="PayBtn">Proceed to Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Modal 1.5: Payment Section --- */}
            {showPaymentModal && (
                <div className="ModalOverlay">
                    <div className="ModalContent PaymentContentBox">
                        <h2>Payment Section</h2>
                        <p className="ModalSubText">Scan the QR code to complete your booking.</p>

                        <div className="PaymentDisplay">
                            <div className="QRBox">
                                <img src={ImageCenter.MyQRCode} alt="Payment QR" />
                            </div>
                            <div className="TotalAmountBox">
                                <p>Total Amount to Pay</p>
                                <h3 className="LargePrice">₹{totalPrice}</h3>
                            </div>
                        </div>

                        <div className="ModalActions">
                            <button
                                type="button"
                                className="CancelBtn"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowModal(true); // Go back to details
                                }}
                            >
                                Back
                            </button>
                            <button type="button" className="PayBtn" onClick={handleFinalBooking}>
                                I have Paid & Book
                            </button>
                        </div>

                        <p className="RightsText">© 2026 All rights reserved for Parkly.</p>
                    </div>
                </div>
            )}

            {/* --- Modal 2: Success Ticket & Generated QR --- */}
            {showTicketModal && currentTicket && (
                <div className="ModalOverlay">
                    <div className="ModalContent TicketContent">
                        <div className="TicketHeader">
                            <h2>Booking Successful! 🎉</h2>
                            <p>Please present this QR code at the entry gate.</p>
                        </div>

                        <div className="TicketBody">
                            <div className="TicketQRContainer">
                                <img
                                    src={"https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=" + encodeURIComponent(window.location.origin + "/bookedhistory?ticket=" + currentTicket.bookingId)}
                                    alt="Access QR Code"
                                />
                                <h3>{currentTicket.bookingId}</h3>
                            </div>

                            <div className="TicketDetails">
                                <div className="DetailRow"><span>Name:</span> <strong>{currentTicket.name}</strong></div>
                                <div className="DetailRow">x<span>Date:</span> <strong>{currentTicket.date}</strong></div>
                                <div className="DetailRow"><span>Time:</span> <strong>{currentTicket.inTime} to {currentTicket.outTime}</strong></div>
                                <div className="DetailRow"><span>Slots:</span> <strong>{currentTicket.slots.join(', ')}</strong></div>
                                <div className="DetailRow"><span>Vehicle:</span> <strong>{currentTicket.plateNumber}</strong></div>
                            </div>
                        </div>

                        <div className="ModalActions" style={{ justifyContent: 'center', marginTop: '20px' }}>
                            <button className="PayBtn BezMargin" onClick={() => setShowTicketModal(false)}>Close Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookCenter;