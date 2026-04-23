import React, { useState, useEffect } from 'react';
// 1. NEW: Imported Polyline
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../ComponentCSS/HeroSect.css';
import { ImageCenter } from '../assets/assest';
import Toast from './Toast';

// Import Clerk hooks and components
import { useAuth, SignInButton } from "@clerk/clerk-react";

// Fix for Leaflet Default Icon (Used for your Current Location)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Parking Spots
const parkingIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2892/2892705.png',
    iconSize: [35, 35],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30]
});

const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 14);
    }, [position, map]);
    return null;
};

const HeroSect = () => {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    // --- States ---
    const [position, setPosition] = useState(() => {
        const savedLoc = localStorage.getItem('userParkingLocation');
        return savedLoc ? JSON.parse(savedLoc).coords : [28.6139, 77.2090];
    });

    const [address, setAddress] = useState(() => {
        const savedLoc = localStorage.getItem('userParkingLocation');
        return savedLoc ? JSON.parse(savedLoc).address : "";
    });

    const [parkingSpots, setParkingSpots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Track the selected parking lot
    const [selectedParking, setSelectedParking] = useState(() => {
        const savedPark = localStorage.getItem('selectedParkingDestination');
        return savedPark ? JSON.parse(savedPark) : null;
    });

    // 2. NEW: State to store the Route Path (Array of coordinates)
    const [routePath, setRoutePath] = useState(() => {
        const savedRoute = localStorage.getItem('userParkingRoute');
        return savedRoute ? JSON.parse(savedRoute) : null;
    });

    // Toast & Modal States
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            setShowLoginPopup(false);
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (address) {
            fetchNearbyParking(position[0], position[1]);
        }
    }, []);

    const fetchNearbyParking = async (lat, lon) => {
        const radius = 10000;
        const query = `
            [out:json];
            (
              node["amenity"="parking"](around:${radius},${lat},${lon});
              way["amenity"="parking"](around:${radius},${lat},${lon});
            );
            out center;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setParkingSpots(data.elements || []);

            // Clear selection and route when the user changes their base location
            setSelectedParking(null);
            setRoutePath(null);
            localStorage.removeItem('selectedParkingDestination');
            localStorage.removeItem('userParkingRoute');
        } catch (error) {
            console.error("Error fetching parking spots:", error);
        }
    };

    // 3. NEW: Fetch the shortest route using the free OSRM API
    const fetchRoute = async (startCoords, endCoords) => {
        try {
            // OSRM requires coordinates in [longitude, latitude] format
            const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                // GeoJSON returns [lon, lat], but Leaflet polyline needs [lat, lon]
                const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

                setRoutePath(routeCoords);
                // Save the route to local storage!
                localStorage.setItem('userParkingRoute', JSON.stringify(routeCoords));
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const getAddressFromCoords = async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const newAddress = data.display_name || "Location Selected";

            setAddress(newAddress);

            localStorage.setItem('userParkingLocation', JSON.stringify({
                address: newAddress,
                coords: [lat, lon]
            }));

            fetchNearbyParking(lat, lon);
        } catch (err) { console.error(err); }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                getAddressFromCoords(lat, lng);
            },
        });
        return <Marker position={position} />;
    };

    const handleAutoDetect = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                setPosition(newPos);
                getAddressFromCoords(newPos[0], newPos[1]);
                setLoading(false);
            }, () => {
                setToastMessage("Location access denied!");
                setShowToast(true);
                setLoading(false);
            });
        }
    };

    // --- Logic for "Grab A Spot" ---
    const handleGrabSpot = () => {
        if (!address) {
            setToastMessage("Please set your current location first!");
            setShowToast(true);
            return;
        }

        if (!selectedParking) {
            setToastMessage("Please click on a parking icon on the map to select it!");
            setShowToast(true);
            return;
        }

        if (!isSignedIn) {
            setShowLoginPopup(true);
        } else {
            navigate('/bookcenter', {
                state: {
                    selectedAddress: selectedParking.name,
                    coords: selectedParking.coords
                }
            });
        }
    };

    return (
        <div className="HeroSection">
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="LeftHero">
                <h1>Best Space Car <br /> Parking Area</h1>
                <p>Your journey doesn't end when you arrive; it ends when you're parked. We make sure that transition is flawless.</p>

                <div className="BoxLocationDetector">
                    <input type="text" value={address} readOnly placeholder="1. Set your current location..." />
                    <button onClick={handleAutoDetect}>{loading ? "Detecting..." : "Current Location"}</button>
                </div>

                <div className="BoxLocationDetector" style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        value={selectedParking ? selectedParking.name : ""}
                        readOnly
                        placeholder="2. Select a parking area from the map below..."
                        style={{ width: '100%', borderColor: selectedParking ? '#28a745' : '#895CF5' }}
                    />
                </div>

                <div className="MapContainer" style={{ height: "400px", marginTop: "20px", borderRadius: "15px", overflow: 'hidden' }}>
                    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} attributionControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <RecenterMap position={position} />

                        {/* The Default Blue Marker represents the User's Current Location */}
                        <LocationMarker />

                        {/* 4. NEW: Draw the route line if we have one */}
                        {routePath && (
                            <Polyline
                                positions={routePath}
                                color="#895CF5"
                                weight={5}
                                opacity={0.8}
                                dashArray="10, 10" // Makes the line slightly dashed for a cool UI effect
                            />
                        )}

                        {/* Rendering the Parking Markers */}
                        {parkingSpots.map((spot, idx) => {
                            const spotName = spot.tags.name || "General Parking Area";
                            const spotLat = spot.lat || spot.center.lat;
                            const spotLon = spot.lon || spot.center.lon;
                            const isSelected = selectedParking && selectedParking.coords[0] === spotLat;

                            return (
                                <Marker
                                    key={idx}
                                    position={[spotLat, spotLon]}
                                    icon={parkingIcon}
                                    eventHandlers={{
                                        click: () => {
                                            const newSelection = {
                                                name: spotName,
                                                coords: [spotLat, spotLon]
                                            };

                                            // Set the state
                                            setSelectedParking(newSelection);

                                            // Save to Local Storage immediately
                                            localStorage.setItem('selectedParkingDestination', JSON.stringify(newSelection));

                                            // Trigger the route drawing calculation
                                            fetchRoute(position, [spotLat, spotLon]);
                                        }
                                    }}
                                >
                                    <Popup>
                                        <div style={{ textAlign: 'center' }}>
                                            <b>{spotName}</b> <br />
                                            <span style={{ fontSize: '12px', color: '#666' }}>Type: {spot.tags.parking || "General"}</span><br />
                                            {isSelected ? (
                                                <span style={{ color: '#28a745', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>✅ Selected for Booking</span>
                                            ) : (
                                                <span style={{ color: '#895CF5', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>Click to select this spot</span>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                <button className='BookingButton EditedBtn' onClick={handleGrabSpot}>
                    Grab A Spot
                </button>
            </div>

            <div className="RightHero">
                <img src={ImageCenter.HeroImage} alt="Hero" />
            </div>

            {/* --- Login Required Popup Modal --- */}
            {showLoginPopup && (
                <div className="LoginModalOverlay">
                    <div className="LoginModalContent">
                        <h2>Login Required</h2>
                        <p>You must be logged in to book a parking spot. Please log in or create an account to continue.</p>

                        <div className="LoginModalActions">
                            <button
                                onClick={() => setShowLoginPopup(false)}
                                className="LoginCancelBtn"
                            >
                                Cancel
                            </button>

                            <SignInButton mode="modal">
                                <button className="LoginActionBtn">
                                    Go to Login
                                </button>
                            </SignInButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroSect;