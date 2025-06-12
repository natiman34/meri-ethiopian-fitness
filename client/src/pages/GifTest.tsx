import React from 'react';
import AnimatedGif from '../components/AnimatedGif';
import EmailTest from '../components/utils/EmailTest';

const GifTest: React.FC = () => {
  const testGifs = [
    '/images/exercises/bench-press.gif',
    '/images/exercises/incline-dumbbell-press.gif',
    '/images/exercises/shoulder-press-db-bb.gif',
    '/images/exercises/lateral-raises.gif',
    '/images/exercises/triceps-dips.gif',
    '/images/exercises/skull-crushers.gif',
    '/images/exercises/light-jogging-rowing.gif',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Email Service Test</h1>
      <EmailTest />
      <h1 className="text-3xl font-bold mb-8">GIF Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testGifs.map((gif, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Test GIF {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-2">{gif}</p>
            <AnimatedGif
              src={gif}
              alt={`Test GIF ${index + 1}`}
              className="w-full h-48"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifTest; 