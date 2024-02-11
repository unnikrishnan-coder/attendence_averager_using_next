"use client"
import FallBackUI from '@/components/FallBackUi/FallBackUI';
import React, { useState, useEffect } from 'react';

function ErrorBoundary({ children }:{children:React.ReactNode}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      // Log the error or send it to an error tracking service
      console.error('Error occurred within the ErrorBoundary');
    }
  }, [hasError]);

  if (hasError) {
    return <FallBackUI />;
  }

  return children;
};

export default ErrorBoundary;