import React from 'react';
import { Link } from 'react-router-dom';
import '../css/page-1.css';
import '../css/page-2.css';
import '../css/page-3.css';
import '../css/page-4.css';
import '../css/page-5.css';
import  xlogo from '../assets/x.png';

// Import images
import logo from '../assets/logo.png';
import legal from '../assets/legal.png';
import health from '../assets/health.png';
import house from '../assets/house.png';
import business from '../assets/business.png';
import writing from '../assets/writing.png';
import workBackground from '../assets/work.png';

const Home = () => {
    return (
        <div><nav className="navbar">
                    <div className="logo">
                        <img src={logo} alt="ARAG Logo" />
                    </div>
                    <ul className="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/login">Resource</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/login">Profile</a></li>
                        <li><a href="/login"><button className="login-btn">Log In</button></a></li>
                        <li><a href="/signin"><button className="get-started-btn">Get Started</button></a></li>
                    </ul>
                </nav>
            
           

            {/* Hero Section */}
            <header
    className="hero-section"
    style={{backgroundImage: `url(${workBackground})`, backgroundSize: 'cover',  backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
    <div className="hero-content">
        <h2 className='s'>ARAG Trusted Tax Filing, Simplified for You!</h2>
        <p>ARAG's tax filing document generation website offers a seamless and secure platform to create accurate, compliant tax documents.</p>
          </div>
      </header>

            {/* Success Section */}
            <div className="success-section">
                <div className="success-left">
                    <h2>15 years and counting of Success.</h2>
                    <div className="stats-grid">
                        {[
                            { number: '7 Lakh+', label: 'Translations' },
                            { number: '30+', label: 'Sample Documents' },
                            { number: '1000+', label: 'Agencies worked with' },
                            { number: '50+', label: 'Continents of clients' },
                            { number: '4', label: 'Awards' },
                            { number: '8', label: 'Nominations' },
                            { number: '2', label: 'Certifications' },
                            { number: '5', label: 'Core fields of specialization' }
                        ].map((item, index) => (
                            <div key={index} className="stat-item">
                                <h3>{item.number}</h3>
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="success-right">
                    <h2>99.25% <br /><span className="highlight">Success Rate</span>.</h2>
                    <p className="only-on">Only On ARAG</p>
                    <img src={logo} alt="ARAG Logo" className="arag-logo" />
                </div>
            </div>

            {/* Services Section */}
            <section className="services-section">
                <div className="services-left">
                    <p className="services-label">| SERVICES</p>
                    <h1 className='c'>What we offer<span className="highlight">.</span></h1>
                    <p className="services-description">
                        ARAG offers personal insurance, business insurance, and specialized coverage. We provide 24/7 claims support, customizable policies, and tailored risk management solutions.
                    </p>
                    <p className="get-started">
                        <span className="highlight">Get started →</span>
                    </p>
                </div>
                <div className="services-right">
                    {[
                        { img: legal, title: 'LEGAL PROTECTION', desc: 'Comprehensive legal coverage for your peace of mind.' },
                        { img: health, title: 'HEALTH & PREVENTION', desc: 'Proactive solutions for a healthier future.' },
                        { img: house, title: 'HOUSE, PET & TRAVEL', desc: 'Protect what matters most, wherever you are.' },
                        { img: business, title: 'BUSINESS & ASSOCIATIONS', desc: 'Tailored coverage for professional success.' }
                    ].map((service, index) => (
                        <div key={index} className="service-card">
                            <img src={service.img} alt={service.title} className="service-icon" />
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Achievements Section */}
            <section className="achievements-section">
                <div className="achievements-left">
                    <p className="section-label">| AWARDS & CERTIFICATIONS</p>
                    <h1 className='n'>Our <span className="highlight">8 years </span> of achievements<span className="highlight">.</span></h1>
                    <p className="achievements-description">With our dedication, we've reached remarkable milestones.</p>
                    <div className="achievement-stats">
                        {[
                            { number: '23', label: 'Branches' },
                            { number: '120', label: 'Happy Clients' },
                            { number: '8+', label: 'Years of Excellence' },
                            { number: '1.4k', label: 'Projects Completed' }
                        ].map((achievement, index) => (
                            <div key={index} className="stat">
                                <h2 className="highlight">{achievement.number}</h2>
                                <p>{achievement.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="achievements-right">
                    <img src={writing} alt="Achievements Image" />
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-left">
                    <p className="section-label">| CONTACT</p>
                    <h1>Connect with <span className="highlight">us.</span></h1>
                    <p className="contact-description">
                        Reach out through the following channels. Our team is available from 9 AM to 6 PM, GMT+1.
                    </p>
                    <div className="contact-details">
                        <p>📞 +91 9894055399 | ✉ contact.liveingermany@gmail.com</p>
                        <p>💬 +49 176 99728898 | iliveingermany</p>
                    </div>
                </div>
                <div className="contact-right">
                    <div className="circle-icons">
                        {[
                            { href: 'https://wa.me/1234567890', img: 'https://cdn-icons-png.flaticon.com/512/3536/3536445.png', alt: 'WhatsApp' },
                            { href: 'mailto:example@email.com', img: 'https://cdn-icons-png.flaticon.com/512/732/732200.png', alt: 'Email' },
                            { href: 'https://twitter.com/example', img:xlogo , alt: 'X (Twitter)' },
                            { href: 'https://linkedin.com/in/example', img: 'https://cdn-icons-png.flaticon.com/512/145/145807.png', alt: 'LinkedIn' }
                        ].map((icon, index) => (
                            <a key={index} href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={icon.alt}>
                                <img src={icon.img} alt={icon.alt} className="icon" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;