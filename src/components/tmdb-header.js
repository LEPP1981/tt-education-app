import React from 'react';
import mainLogo from '../img/logo.png';

const PageHeader = () => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <header className="page-header" style={{ width: '100%' }}>
      <img
        src={mainLogo}
        alt="Logo"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
    </header>
  );
};

export default PageHeader;
