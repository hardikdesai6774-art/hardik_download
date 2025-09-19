import React from 'react';
import { DESIGN_TOKENS } from '@/lib/constants';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className={`${DESIGN_TOKENS.maxWidth} w-full mx-auto flex ${DESIGN_TOKENS.headerHeight} items-center justify-between ${DESIGN_TOKENS.padding}`}>
        {/* Left: App icon (small) */}
        <img
          src="https://i.ibb.co/whC9JDTv/Untitled-design-4.png"
          alt="App icon"
          className="h-7 w-7 rounded-lg shadow-sm"
        />

        {/* Right: Blue circular badge */}
        <div className={`h-8 w-8 rounded-full ${DESIGN_TOKENS.colors.primary} flex items-center justify-center ${DESIGN_TOKENS.shadows.sm}`}>
          <span className="text-white text-lg">💖</span>
        </div>
      </div>
    </header>
  );
};

export default Header;