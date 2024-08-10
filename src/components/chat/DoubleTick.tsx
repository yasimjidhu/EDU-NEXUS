import React from 'react';

const DoubleTick: React.FC<{ color?: string }> = ({ color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15" fill={color}>
    <path d="M13.803 2.322L7.53 10.37a.32.32 0 0 1-.484.033L4.27 7.867a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.273-8.048a.366.366 0 0 0-.51-.512z"></path>
    <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
  </svg>
);

export default DoubleTick;
