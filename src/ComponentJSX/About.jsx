import React, { useState, useEffect } from "react";
import '../ComponentCSS/About.css'
import { Link } from 'react-router-dom'
import { ImageCenter } from "../assets/assest";
// import { motion } from "framer-motion";

const About = () => {

    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = "hidden";   // stop scrolling
        } else {
            document.body.style.overflow = "auto";     // allow scrolling
        }

        // Cleanup (very important)
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedMember]);

    return (
        <>
            <section className='AboutSection'>
                <section className="BannerSectionAbout">
                    <h1>Our Journey: Innovating the Way You Park</h1>
                    <p>Discover the passion and technology behind our mission to eliminate parking stress. What started as a simple idea to solve <br /> city congestion has evolved into a seamless digital platform.</p>
                </section>

                <section className='OurJourneyAbout'>
                    <div className="InfoOurJourney">
                        <h1>Our Journey</h1>
                        <p>The foundation of <b>Parkly</b> emerged from a real-life frustration shared by a close friend, <b>Ranjit Maurya</b>. While heading to a crucial career interview, Ranjit found himself trapped in a nightmare: despite arriving in the area on time, he spent over thirty minutes circling for parking. By the time he found a spot, he was significantly late for his interview. Seeing a friend suffer such a high-stakes setback due to a simple parking issue sparked a mission: <b>no one should ever miss an opportunity because of a parking spot</b>.</p>
                        <p>While other platforms exist, we noticed they lacked the speed and precision required for the modern driver. This drove our team to build something better. We integrated a <b>live-map interface</b> with <b>real-time GPS tracking</b> to ensure users aren't just finding a general area, but a specific, available slot.</p>
                        <p>To streamline the experience, we pioneered a <b>seamless QR-code entry system</b>. Upon booking, users receive an instant digital pass; a simple scan at the facility allows them to park and go without touching a ticket or waiting in a queue. Combined with our <b>24/7 dedicated customer support</b>, Parkly isn't just a booking site—it's a commitment to ensuring that your journey ends exactly when you arrive.</p>
                    </div>
                    <div className='ImageOurJourney'>
                        <img src={ImageCenter.OurJourneyImage} />
                    </div>
                </section>
            </section>

            <section className='OurMissionAbout'>
                <p>What we believe in</p>
                <h1>Our Mission & Values</h1>
                <span>Our company exists to eliminate the stress of urban travel by providing seamless, reliable parking solutions for every driver. At Parkly, we believe <br /> that smart technology should simplify life, starting with the moment you arrive. Our values guide every decision we make, <br /> from real-time data accuracy to ensuring a secure and effortless experience at every location.</span>

                <div className="ThreeCardsOfInd">
                    <div className="CardsThree">
                        <img src={ImageCenter.MapIcon} />
                        <h1>Accuracy & Reliability</h1>
                        <p>WE LEVERAGE LIVE DATA AND GPS TRACKING TO ENSURE EVERY SLOT LISTED IS AVAILABLE IN REAL-TIME. YOUR TIME IS VALUABLE, AND OUR MISSION IS TO ENSURE YOU NEVER HAVE TO CIRCLE THE BLOCK AGAIN.</p>
                    </div>
                    <div className="CardsThree">
                        <img src={ImageCenter.QR_Code} />
                        <h1>Seamless Innovation</h1>
                        <p>WE ARE COMMITTED TO A TICKETLESS, HASSLE-FREE FUTURE. BY INTEGRATING INSTANT QR-CODE ACCESS AND SECURE DIGITAL PAYMENTS, WE REDUCE CONGESTION AND MAKE URBAN MOBILITY FASTER AND SMARTER FOR EVERYONE.</p>
                    </div>
                    <div className="CardsThree">
                        <img src={ImageCenter.Customer_Service} />
                        <h1>24/7 Customer Service</h1>
                        <p>WE BELIEVE IN BEING THERE WHEN YOU NEED US MOST. WHETHER IT'S MIDNIGHT OR RUSH HOUR, OUR DEDICATED SUPPORT TEAM IS AVAILABLE AROUND THE CLOCK TO ENSURE YOUR PARKING EXPERIENCE IS FLAWLESS.</p>
                    </div>
                </div>
            </section>

            {/* <section className='OurTeamAbout'>
                <h1>The People Behind the Munch</h1>
                <p>Our team is a passionate group of developers, problem-solvers, and innovators dedicated to making your urban commute <br /> stress-free. From building precise GPS integrations to ensuring a secure QR-code booking system, <br /> we work tirelessly to bring you convenience and reliability—exactly when you need it.</p>

                <div className="OurTeamPhoto">

                    {[
                        {
                            img: ImageCenter.AyushPhoto,
                            name: "Golu Kumar",
                            role: "Team Leader & FrontEnd Developer",
                            bio: "Ayush leads MNF’s direction...",
                            skills: ["Leadership", "Product Strategy", "Team Management"],
                            social: {
                                instagram: "https://www.instagram.com/offical_ayush_100/",
                                linkedin: "https://linkedin.com/in/ayush-here",
                                email: "mailto:ayush.kbc.695@gmail.com"
                            }
                        },
                        {
                            img: ImageCenter.AnshPhoto,
                            name: "Ansh Raj",
                            role: "FrontEnd Developer",
                            bio: "Ansh designs UI/UX...",
                            skills: ["React.js", "UI/UX", "Animations"],
                            social: {
                                instagram: "https://www.instagram.com/its_ansh_raj_874/",
                                linkedin: "https://www.linkedin.com/in/golu-kumar-375992392/",
                                email: "mailto:golu.kkpncc.99008@gmail.com"
                            }
                        },
                        {
                            img: ImageCenter.AdityaPhoto,
                            name: "Aditya Raj",
                            role: "BackEnd Developer",
                            bio: "Aditya builds backend system...",
                            skills: ["Node.js", "APIs", "Database Architecture"],
                            social: {
                                instagram: "https://www.instagram.com/adityathakur_911/",
                                linkedin: "https://www.linkedin.com/in/aditya-raj-911-/",
                                email: "mailto:adityaraj9112009@gmail.com"
                            }
                        }
                    ].map((member, i) => (
                        <motion.div
                            className="MembersPhoto"
                            key={i}
                            whileHover={{ scale: 1.07 }}
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="MemberNameMain">
                                <img src={member.img} />
                            </div>
                            <h2>{member.name}</h2>
                            <p>{member.role}</p>
                        </motion.div>
                    ))}

                </div>

            </section> */}

            <section className='TasteMagicAbout'>
                <div className="BoxSectionMagic">
                    <div className="Car_Key"><img src={ImageCenter.BMW_Key} /></div>
                    <div className='Hand_Code'><img src={ImageCenter.Hand_Mobile} /></div>
                    <h1>Ready to Park Without the Stress?</h1>
                    <p>Join the Parkly community today and experience the fastest way to secure your slot. Stop wasting time in traffic and start <br /> arriving with confidence using our live-map and instant QR-entry system.</p>
                    <Link to="/"><button>Book Your Slot Now !!</button></Link>
                </div>
            </section>

            {selectedMember && (
                <div className="TeamModalOverlay" onClick={() => setSelectedMember(null)}>
                    <div className="TeamModal" onClick={(e) => e.stopPropagation()}>

                        <button className="CloseModal" onClick={() => setSelectedMember(null)}>
                            ✕
                        </button>

                        <img src={selectedMember.img} className="ModalImg" />

                        <h2>{selectedMember.name}</h2>
                        <p className="ModalRole">{selectedMember.role}</p>
                        <p className="ModalBio">{selectedMember.bio}</p>

                        <div className="ModalSkills">
                            {selectedMember.skills.map((skill, i) => (
                                <span key={i}>{skill}</span>
                            ))}
                        </div>

                        <div className="SocialLinks">
                            <a href={selectedMember.social.instagram} target="_blank">
                                <i className="ri-instagram-line"></i>
                            </a>
                            <a href={selectedMember.social.linkedin} target="_blank">
                                <i className="ri-linkedin-fill"></i>
                            </a>
                            <a
                                href={selectedMember.social.email}
                                target="_self"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    window.location.href = selectedMember.social.email;
                                }}
                            >
                                <i className="ri-mail-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default About