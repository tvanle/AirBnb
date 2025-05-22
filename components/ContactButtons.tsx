'use client';

import { useState } from 'react';
import { SiZalo } from 'react-icons/si';
import { BsMessenger } from 'react-icons/bs';
import { IoIosCall } from 'react-icons/io';

const ContactButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Contact buttons that appear when expanded */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Zalo Button */}
        <a 
          href="https://zalo.me/0394143687" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Contact via Zalo"
          title="Chat on Zalo"
        >
          <SiZalo className="text-2xl" />
        </a>
        
        {/* Messenger Button */}
        <a 
          href="https://www.messenger.com/t/100005695082148" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Contact via Messenger"
          title="Chat on Messenger"
        >
          <BsMessenger className="text-2xl" />
        </a>
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-rose-500 hover:bg-rose-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label="Contact options"
      >
        <IoIosCall className="text-2xl" />
        <span className="absolute -top-1 -right-1 bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
          {isExpanded ? '×' : '+'}
        </span>
      </button>
    </div>
  );
};

export default ContactButtons;