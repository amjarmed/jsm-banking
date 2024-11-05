import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white py-10'>
      <div className='container mx-auto text-center mb-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 64 64'
          width='64'
          height='64'
        >
          {/* <!-- Book --> */}
          <rect
            x='12'
            y='20'
            width='40'
            height='30'
            fill='#f2f2f2'
            stroke='#333'
            strokeWidth='2'
          />
          <line x1='12' y1='20' x2='52' y2='20' stroke='#333' strokeWidth='2' />
          <line x1='12' y1='50' x2='52' y2='50' stroke='#333' strokeWidth='2' />
          <line x1='12' y1='20' x2='12' y2='50' stroke='#333' strokeWidth='2' />
          <line x1='52' y1='20' x2='52' y2='50' stroke='#333' strokeWidth='2' />

          {/* <!-- Graduation Cap --> */}
          <polygon points='32,8 10,20 54,20' fill='#333' />
          <rect x='30' y='10' width='4' height='4' fill='#fff' />

          {/* <!-- Tassel --> */}
          <line
            x1='32'
            y1='12'
            x2='32'
            y2='16'
            stroke='#f2f2f2'
            strokeWidth='2'
          />
          <circle cx='32' cy='16' r='2' fill='#f2f2f2' />
        </svg>
      </div>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'>
        <div>
          <h4 className='font-bold text-lg mb-2'>Resources</h4>
          <ul>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Courses
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Tutorials
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='font-bold text-lg mb-2'>About Us</h4>
          <ul>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Our Story
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Team
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='font-bold text-lg mb-2'>Support</h4>
          <ul>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Contact Us
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                FAQ
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-400 hover:text-white'>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='text-center mt-10'>
        <p className='text-gray-500 text-sm'>
          © 2024 Your Education Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
