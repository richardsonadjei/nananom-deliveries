import React, { useState } from 'react';
import MainHeader from './MainHeader';
import OffcanvasMenu from './OffCanvasMenu';

const Header = () => {
  const [showOffcanvasRight, setShowOffcanvasRight] = useState(false);

  const toggleOffcanvasRight = () => setShowOffcanvasRight(!showOffcanvasRight);
  const handleClose = () => setShowOffcanvasRight(false);
  const handleItemClick = () => setShowOffcanvasRight(false);

  return (
    <header className="fixed-header">
      <MainHeader toggleOffcanvasRight={toggleOffcanvasRight} />
      <OffcanvasMenu
        showOffcanvasRight={showOffcanvasRight}
        handleClose={handleClose}
        handleItemClick={handleItemClick}
      />
    </header>
  );
};

export default Header;
