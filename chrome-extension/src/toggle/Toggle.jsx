import React, { useEffect, useState } from 'react';
import Content from './Content';

const Toggle = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.action === 'toggle-content') {
        console.log('📩 메시지 수신됨: toggle-content');
        setOpen((v) => !v);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return <Content open={open} />;
};

export default Toggle;