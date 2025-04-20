import React, { useState, useEffect } from 'react';
import './attorneySection.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  // Importing both down and up icons
import Attorney1 from '../../assets/attorney1.jpg';
import Attorney2 from '../../assets/attorney2.jpg';
import Attorney3 from '../../assets/attorney3.jpg';

const AttorneysSection = () => {
    const attorneys = [
        { name: 'John Doe', image: Attorney1 , text: 'A very good attorney'},
        { name: 'Jane Smith', image: Attorney2, text: 'A very Proffesional attorney' },
        { name: 'Robert Brown', image: Attorney3, text: '10/10 attorney' },
    ];

    const [visibleCount, setVisibleCount] = useState(3);
    const [showScrollUp, setShowScrollUp] = useState(false);

    const showMoreAttorneys = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    const hideExtraAttorneys = () => {
        setVisibleCount(3);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (window.scrollY > 200) {
            setShowScrollUp(true);
        } else {
            setShowScrollUp(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className="attorneys-section">
            <h2>Our Attorneys</h2>
            <div className="attorneys-container">
                {attorneys.slice(0, visibleCount).map((attorney, index) => (
                    <div className="attorney-card" key={index}>
                        <img src={attorney.image} alt={attorney.name} />
                        <h3>{attorney.name}</h3>
                        <p>{attorney.text}</p>
                    </div>
                ))}
            </div>
            {visibleCount < attorneys.length && (
                <div className="scroll-button" onClick={showMoreAttorneys}>
                    <FaChevronDown size={30} />
                </div>
            )}
            {showScrollUp && visibleCount > 3 && (
                <div className="scroll-up-button" onClick={hideExtraAttorneys}>
                    <FaChevronUp size={30} />
                </div>
            )}
            {visibleCount < attorneys.length && !showScrollUp && (
                <div className="scroll-up-button" onClick={scrollToTop}>
                    <FaChevronUp size={30} />
                </div>
            )}
        </section>
    );
};

export default AttorneysSection;
