import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useUrlChange } from './hooks/useUrlChange';

const App = () => {
  useUrlChange((nowPage) => {
    const iframe = document.getElementById('content-iframe');
    iframe?.contentWindow?.postMessage(
      { action: 'ANNOUNCE_NOW_PAGE', payload: nowPage },
      '*'
    );
  });
  
  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('public/index.html');
    iframe.id = 'content-iframe';
    Object.assign(iframe.style, {
      position: 'fixed',
      bottom: '100px',
      width: '300px',
      height: '510px',
      right: '20px',
      border: 'none',
      zIndex: '999999',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'none', // 초기에는 숨김
    });
    document.body.appendChild(iframe);

    // ✅ 버튼 생성
    const button = document.createElement('button');
    button.textContent = '💬';
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '28px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      zIndex: '1001',
    });

    button.addEventListener('click', () => {
      const isHidden = iframe.style.display === 'none';
      iframe.style.display = isHidden ? 'flex' : 'none';
      iframe.contentWindow?.postMessage({ action: 'toggle-content' }, '*');
    });

    document.body.appendChild(button);

    const handler = (event) => {
      if (event.data?.action === 'REQUEST_DOM') {
        const fullHtml = document.documentElement.outerHTML;
  
        const iframe = document.getElementById('content-iframe');
        iframe?.contentWindow?.postMessage(
          { action: 'SEND_DOM', payload: fullHtml },
          '*'
        );
      }
    };
  
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);

  }, []);

  return null;
};

// React 앱 mount
const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
ReactDOM.createRoot(mountPoint).render(<App />);