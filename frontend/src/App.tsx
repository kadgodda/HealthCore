import React, { useState, useRef, useEffect } from 'react';
import BodySystemsNutrition from './components/BodySystemsNutrition';
import NutritionGameWrapper from './components/NutritionGame/NutritionGameWrapper';
import styles from './App.module.css';

interface Page {
  id: string;
  title: string;
  component: React.ComponentType;
  icon: string;
}

const pages: Page[] = [
  {
    id: 'body-systems',
    title: 'Body Systems',
    component: BodySystemsNutrition,
    icon: '🫀'
  },
  {
    id: 'nutrition-game',
    title: 'Nutrition Game',
    component: NutritionGameWrapper,
    icon: '🎮'
  }
];

const App: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startTimeRef.current = Date.now();
    setIsTransitioning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    
    // Prevent swiping beyond bounds
    if ((currentPageIndex === 0 && diff > 0) || 
        (currentPageIndex === pages.length - 1 && diff < 0)) {
      setSwipeOffset(diff * 0.3); // Reduced movement at boundaries
    } else {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (startXRef.current === null || startTimeRef.current === null) return;
    
    const swipeThreshold = 80;
    const swipeVelocityThreshold = 0.5;
    const timeDiff = Date.now() - startTimeRef.current;
    const velocity = Math.abs(swipeOffset) / timeDiff;

    setIsTransitioning(true);

    if (Math.abs(swipeOffset) > swipeThreshold || velocity > swipeVelocityThreshold) {
      if (swipeOffset > 0 && currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      } else if (swipeOffset < 0 && currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
    }

    setSwipeOffset(0);
    startXRef.current = null;
    startTimeRef.current = null;
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    startTimeRef.current = Date.now();
    setIsTransitioning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startXRef.current === null) return;
    
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    
    if ((currentPageIndex === 0 && diff > 0) || 
        (currentPageIndex === pages.length - 1 && diff < 0)) {
      setSwipeOffset(diff * 0.3);
    } else {
      setSwipeOffset(diff);
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (startXRef.current !== null) {
      handleTouchEnd();
    }
  };

  const navigateToPage = (index: number) => {
    setIsTransitioning(true);
    setCurrentPageIndex(index);
  };

  return (
    <div className={styles.app}>
      {/* Header with Navigation */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>HealthCore</h1>
          <nav className={styles.nav}>
            {pages.map((page, index) => (
              <button
                key={page.id}
                className={`${styles.navButton} ${index === currentPageIndex ? styles.active : ''}`}
                onClick={() => navigateToPage(index)}
              >
                <span className={styles.navIcon}>{page.icon}</span>
                <span className={styles.navTitle}>{page.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Swipeable Content */}
      <main 
        ref={containerRef}
        className={styles.main}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {pages.map((page, index) => {
          const PageComponent = page.component;
          const isActive = index === currentPageIndex;
          const offset = (index - currentPageIndex) * 100;
          
          return (
            <div 
              key={page.id} 
              className={styles.page}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `translateX(calc(${offset}% + ${swipeOffset}px))`,
                transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
                visibility: Math.abs(index - currentPageIndex) > 1 ? 'hidden' : 'visible'
              }}
            >
              <PageComponent />
            </div>
          );
        })}
      </main>

      {/* Page Indicators */}
      <div className={styles.indicators}>
        {pages.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentPageIndex ? styles.active : ''}`}
            onClick={() => navigateToPage(index)}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default App;