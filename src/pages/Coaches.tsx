
import React from 'react';
import CoachesList from '@/components/coaches/CoachesList';
import Navbar from '@/components/Navbar';

const Coaches = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CoachesList />
    </div>
  );
};

export default Coaches;
