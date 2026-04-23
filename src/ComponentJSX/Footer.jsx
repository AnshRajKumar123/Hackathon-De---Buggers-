import React from 'react'
import '../ComponentCSS/Footer.css'
import { Link } from 'react-router-dom'
import { ImageCenter } from '../assets/assest'

const Footer = () => {
    return (
        <footer>
            <div className="WebLogoFooter">
                <img src={ImageCenter.WebLogo} />
            </div>

            <div className='FlexFooterLine'>
                <ul>
                    <li><b>Company</b></li><br />
                    <li><a href="#">CARKLY</a></li><br />
                    <li><a href="#">Serving India</a></li><br />
                    <li><a href="#">Investor Relations</a></li>
                </ul>
                <ul>
                    <li><b>For Business</b></li><br />
                    <li><a href="#">Partner with Us</a></li><br />
                    <li><a href="#">Apps for you</a></li><br />
                </ul>
                <ul>
                    <li><b>Parking Places</b></li><br />
                    <li><a href="#">Delhi</a></li><br />
                    <li><a href="#">Mumbai</a></li><br />
                    <li><a href="#">Chandigard</a></li><br />
                    <li><a href="#">Punjab</a></li><br />
                </ul>
                <ul>
                    <li><b>Legal</b></li><br />
                    <li><a href='' target='blank'>Privacy</a></li><br />
                    <li><a href='' target='blank'>Security</a></li><br />
                    <li><a href='' target='blank'>Terms of Service</a></li><br />
                    <li><Link to="/">Help and Support</Link></li><br />
                    <li><Link to="/">Report a Fraud</Link></li><br />
                </ul>
                <ul>
                    <li><b>Social Links</b></li>
                    <li>
                        <a href=""><i className='bx bxl-linkedin'></i></a>
                        <a href="https://www.instagram.com/midnightnfood/" target='blank'><i className='bx bxl-instagram' ></i></a>
                        <a href=""><i className='bx bxl-facebook' ></i></a>
                        <a href=""><i className="fa-brands fa-x-twitter"></i></a>
                    </li>
                    <li><img src={ImageCenter.IOS} /></li>
                    <li><img src={ImageCenter.GooglePlay} /></li>
                </ul>
            </div>

            <hr className='HoriLine' />

            <p className='BoxiBtn'>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners 2008-2026 © Parkly Ltd. All rights reserved.</p>
        </footer>
    )
}

export default Footer