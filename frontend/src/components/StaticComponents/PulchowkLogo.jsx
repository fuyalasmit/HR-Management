import React from 'react';

const PulchowkLogo = ({ style }) => {
  return (
    <div style={{ 
      fontSize: '28px', 
      fontWeight: 'bold', 
      textAlign: 'center',
      fontFamily: 'Roboto, sans-serif',
      ...style 
    }}>
      <span style={{ color: '#000000' }}>Pulchowk</span>
      <span style={{ color: '#8B5CF6', marginLeft: '8px' }}>Campus</span>
    </div>
  );
};

export default PulchowkLogo;
