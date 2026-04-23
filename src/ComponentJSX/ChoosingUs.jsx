import React from 'react'
import '../ComponentCSS/ChoosingUs.css'
import { ImageCenter } from '../assets/assest'

const ChoosingUs = () => {
    return (
        <>
            <section className='ChoosingSection'>
                <div className="LeftSider">
                    <h1>Why Choose Us</h1>

                    <p>Experience the future of parking with our seamless QR-based booking system. Simply reserve your spot online to receive a unique digital pass. Upon arrival, scan your QR code at the entrance for instant access—no tickets, no cash, and no delays. We offer secure, well-lit facilities and real-time navigation, ensuring a fast, safe, and entirely contactless parking experience every time.</p>

                    <button className='EditedBtn'>Read More !!</button>
                </div>
                <div className="RightSider">
                    <div>
                        <img src={ImageCenter.Photo1} />
                        <img src={ImageCenter.Photo2} />
                    </div>
                    <div>
                        <img src={ImageCenter.Photo3} />
                        <img src={ImageCenter.Photo4} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default ChoosingUs