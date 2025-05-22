
import React from 'react';
import GroupsList from '@/components/groups/GroupsList';
import Navbar from '@/components/Navbar';

const Groups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <GroupsList />
    </div>
  );
};

export default Groups;
