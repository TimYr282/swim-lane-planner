
import React from 'react';
import AthletesList from '@/components/athletes/AthletesList';
import Navbar from '@/components/Navbar';

const Athletes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AthletesList />
    </div>
  );
};

export default Athletes;
