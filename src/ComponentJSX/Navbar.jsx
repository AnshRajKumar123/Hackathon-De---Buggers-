import React, { useState, useEffect } from 'react';
import '../ComponentCSS/Navbar.css';
import { ImageCenter } from '../assets/assest';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    // State to manage navbar visibility
    const [showNav, setShowNav] = useState(true);
    // State to track the last scroll position
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // If we are at the very top of the page, always show it
            if (currentScrollY < 50) {
                setShowNav(true);
            }
            // If scrolling down, hide the navbar
            else if (currentScrollY > lastScrollY) {
                setShowNav(false);
            }
            // If scrolling up, show the navbar
            else {
                setShowNav(true);
            }

            // Update the last scroll position to the current one
            setLastScrollY(currentScrollY);
        };

        // Add the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]); // Re-run effect when lastScrollY changes

    return (
        // Dynamically apply a class based on the showNav state
        <nav className={showNav ? 'nav-visible' : 'nav-hidden'}>
            <div className="FirstSide">
                <Link to='/' className='WebsiteLogo'>
                    <img src={ImageCenter.WebLogo} alt="Parkly Logo" />
                </Link>
            </div>
            <div className="SecondSide">
                <ul>
                    <NavLink to='/' className='SameKamKeLiye'>
                        Home
                    </NavLink>

                    <NavLink to='/about' className='SameKamKeLiye'>
                        About Us
                    </NavLink>

                    <NavLink to='/bookedhistory' className='SameKamKeLiye'>
                        Booked History
                    </NavLink>

                    <div className="DropDownBox">
                        <button className='SameKamKeLiye ForIcons'>
                            More <i className='bx bxs-down-arrow'></i>
                        </button>
                        <div className="ForSpaceBox">
                            <div className="DropListBox">
                                <span>Notification</span>
                                <Link to='/reportfraud'>Report A Fraud</Link>
                                <Link to='/helpsupport'>Help And Support</Link>
                            </div>
                        </div>
                    </div>

                    <div className="AuthWrapper">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="ClerkLoginBtn">Login</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: {
                                            width: "40px",
                                            height: "40px",
                                            border: "2px solid #895CF5",
                                            transition: "0.3s",
                                        }
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;