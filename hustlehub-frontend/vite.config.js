import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://localhost:5000 ws://localhost:5173",
];
const csp = cspDirectives.join('; ');

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
};

export default defineConfig({
  plugins: [react()],

  // Development server: the CSP is report-only because Vite injects an inline
  // script for React hot reloading, which script-src 'self' would block.
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Content-Security-Policy-Report-Only': csp,
      ...securityHeaders,
    },
  },

  // Production build (npm run build && npm run preview): no inline scripts,
  // so the same CSP is enforced. Same port as dev so CLIENT_ORIGIN still matches.
  preview: {
    port: 5173,
    strictPort: true,
    headers: {
      'Content-Security-Policy': csp,
      ...securityHeaders,
    },
  },
});
