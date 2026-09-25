import { createContext } from 'react';

// Kept in its own file so AuthContext.jsx only exports components (required by React Fast Refresh)
export const AuthContext = createContext(null);
