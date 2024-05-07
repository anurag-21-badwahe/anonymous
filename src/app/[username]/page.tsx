import React from 'react';

const Username = ({ params }: any) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mx-auto my-36 w-40">
      <div className="text-xl font-bold mb-2 text-center">Username</div>
      <div className="bg-white rounded-lg p-4 text-center">
        <div className="text-lg mb-2">{params.username}</div>
      </div>
    </div>
  );
};

export default Username;
