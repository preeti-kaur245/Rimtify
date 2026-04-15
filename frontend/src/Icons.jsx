import React from 'react';

const Icon = ({ path, className = "", size = 20, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ flexShrink: 0 }}
  >
    {path}
  </svg>
);

export const Icons = {
  Students: (props) => (
    <Icon {...props} path={
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    } />
  ),
  Attendance: (props) => (
    <Icon {...props} path={
      <>
        <path d="M12 2v20" />
        <path d="m2 12 5.01 5.01L12 12" />
        <path d="m22 12-5.01-5.01L12 12" />
        <circle cx="12" cy="12" r="10" />
      </>
    } />
  ),
  Tick: (props) => (
    <Icon {...props} path={<path d="M20 6 9 17l-5-5" />} />
  ),
  Cross: (props) => (
    <Icon {...props} path={
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    } />
  ),
  History: (props) => (
    <Icon {...props} path={
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </>
    } />
  ),
  Edit: (props) => (
    <Icon {...props} path={
      <>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </>
    } />
  ),
  Delete: (props) => (
    <Icon {...props} path={
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </>
    } />
  ),
  Book: (props) => (
    <Icon {...props} path={
      <>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6.5 15.5H20" />
      </>
    } />
  ),
  Search: (props) => (
    <Icon {...props} path={
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    } />
  ),
  Plus: (props) => (
    <Icon {...props} path={
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    } />
  ),
  Back: (props) => (
    <Icon {...props} path={
      <>
        <path d="m15 18-6-6 6-6" />
      </>
    } />
  ),
  Date: (props) => (
    <Icon {...props} path={
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    } />
  ),
  Note: (props) => (
    <Icon {...props} path={
      <>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </>
    } />
  ),
  Upload: (props) => (
    <Icon {...props} path={
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </>
    } />
  ),
  Video: (props) => (
    <Icon {...props} path={
      <>
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </>
    } />
  ),
  User: (props) => (
    <Icon {...props} path={
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    } />
  ),
  Save: (props) => (
    <Icon {...props} path={
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </>
    } />
  ),
  Chart: (props) => (
    <Icon {...props} path={
      <>
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </>
    } />
  ),
  Logout: (props) => (
    <Icon {...props} path={
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </>
    } />
  ),
  Pin: (props) => (
    <Icon {...props} path={
      <>
        <line x1="12" x2="12" y1="17" y2="22" />
        <path d="M5 17h14v-2l-1.5-1.5V6a3.5 3.5 0 0 0-7 0v7.5L9 15v2z" />
      </>
    } />
  ),
  File: (props) => (
    <Icon {...props} path={
      <>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    } />
  ),
  ChevronRight: (props) => (
    <Icon {...props} path={<polyline points="9 18 15 12 9 6" />} />
  ),
  Home: (props) => (
    <Icon {...props} path={
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    } />
  ),
  Menu: (props) => (
    <Icon {...props} path={
      <>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </>
    } />
  ),
  X: (props) => (
    <Icon {...props} path={
      <>
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </>
    } />
  ),
  Download: (props) => (
    <Icon {...props} path={
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </>
    } />
  ),
  Eye: (props) => (
    <Icon {...props} path={
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    } />
  )
};
