import { useEffect } from 'react';

export function useUrlChange(onChange) {
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUrl = window.location.href;
      onChange(currentUrl); // ← 무조건 실행
    }, 1000); // 예: 1초마다

    return () => clearInterval(interval);
  }, [onChange]);
}