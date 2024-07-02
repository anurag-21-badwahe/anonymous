/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

import withPWA from 'next-pwa';

// Define PWA options
const pwaOptions = {
  dest: 'public',
};

// Export the combined configuration
export default withPWA(pwaOptions)(nextConfig);
