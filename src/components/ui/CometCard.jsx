import React, { useRef, useState } from 'react';

const CometCard = ({ 
  children, 
  className = '', 
  rotateDepth = 17.5, 
  translateDepth = 20 
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * rotateDepth;
    const rotateY = -(mouseX / rect.width) * rotateDepth;
    const translateX = (mouseX / rect.width) * translateDepth;
    const translateY = (mouseY / rect.height) * translateDepth;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateX(${translateX}px)
      translateY(${translateY}px)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        translateX(0px)
        translateY(0px)
        scale3d(1, 1, 1)
      `;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-200 ease-out transform-gpu ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Comet effect - glowing border that appears on hover */}
      <div
        className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            linear-gradient(45deg, 
              rgba(59, 130, 246, 0.5) 0%, 
              rgba(147, 51, 234, 0.5) 25%, 
              rgba(236, 72, 153, 0.5) 50%, 
              rgba(245, 101, 101, 0.5) 75%, 
              rgba(59, 130, 246, 0.5) 100%
            )
          `,
          backgroundSize: '400% 400%',
          animation: isHovered ? 'gradientShift 3s ease infinite' : 'none',
          filter: 'blur(1px)',
          zIndex: -1,
        }}
      />
      
      {/* Main card content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CometCard;
