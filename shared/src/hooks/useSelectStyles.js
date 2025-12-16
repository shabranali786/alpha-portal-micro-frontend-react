import { useMemo } from 'react';
import { createSelectStyles } from '../utils/selectStyles';
import { useDarkModeState } from './useDarkMode';

export const useSelectStyles = (config = {}) => {
  const isDarkMode = useDarkModeState();
  
  return useMemo(() => 
    createSelectStyles({ 
      ...config, 
      isDarkMode 
    }), 
    [isDarkMode, config]
  );
};