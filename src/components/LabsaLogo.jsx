import React, { useEffect, useRef } from 'react';
import './LabsaLogo.css';

const LabsaLogo = () => {
  const logoRef = useRef(null);
  
  useEffect(() => {
    const logoContainer = logoRef.current;
    if (logoContainer) {
      const circles = logoContainer.querySelectorAll('.labsa-circle');
      circles.forEach(circle => {
        circle.style.transform = 'translateY(-50px)';
        circle.style.opacity = '0';
      });
      
      setTimeout(() => {
        circles.forEach((circle, index) => {
          setTimeout(() => {
            circle.style.transform = 'translateY(0)';
            circle.style.opacity = '1';
          }, index * 150);
        });
        
        setTimeout(() => {
          const labsaText = logoContainer.querySelector('.labsa-text');
          if (labsaText) {
            labsaText.style.opacity = '1';
            labsaText.style.transform = 'translateY(0)';
          }
        }, 1000);
      }, 300);
    }
  }, []);

  return (
    <div className="labsa-logo-container" ref={logoRef}>
      <div className="labsa-logo-symbol">
        <div className="labsa-circle circle-1"></div>
        <div className="labsa-circle circle-2"></div>
        <div className="labsa-circle circle-3"></div>
        <div className="labsa-circle circle-4"></div>
        <div className="labsa-shadow"></div>
      </div>
      <div className="labsa-text">LABSA</div>
    </div>
  );
};

export default LabsaLogo;