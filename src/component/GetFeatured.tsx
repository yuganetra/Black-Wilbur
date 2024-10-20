// GetFeatured.tsx

import React from 'react';

const GetFeatured: React.FC = () => {
  return (
    <div className="relative w-full p-4 md:p-8 bg-black bg-opacity-30 text-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Get Featured on BlackWilbur.com!</h2>
      <p className="text-lg md:text-xl mb-4 text-center">Showcase your style with these simple steps:</p>
      <ol className="list-decimal list-inside text-base md:text-lg space-y-2">
        <li className="transition hover:text-yellow-400 ">✨ Buy our products.</li>
        <li className="transition hover:text-yellow-400 ">🎥 Shoot a video with a black and gray background.</li>
        <li className="transition hover:text-yellow-400 ">📸 Send 2 photos (16:9 ratio).</li>
        <li className="transition hover:text-yellow-400 ">⏱️ Video duration: 25 to 30 seconds.</li>
        <li className="transition hover:text-yellow-400 ">📧 Send everything to our email.</li>
        <li className="transition hover:text-yellow-400 ">✅ If selected, we’ll reach out via email.</li>
        <li className="transition hover:text-yellow-400 ">🤝 Not selected? We'll collaborate on Instagram!</li>
        <li className="transition hover:text-yellow-400 ">🌐 Get featured on our website.</li>
        <li className="transition hover:text-yellow-400 ">🎁 Receive gifts and special offers!</li>
      </ol>
      <p className="mt-6 text-base md:text-lg text-center">We can’t wait to see your creativity! 💖</p>
    </div>
  );
};

export default GetFeatured;
