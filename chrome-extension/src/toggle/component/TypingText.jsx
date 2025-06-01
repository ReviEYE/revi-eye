import React, {useEffect, useState} from "react";

export const TypingText = ({text, children, speed = 50}) => {
    const content = text || children || '';
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + content.charAt(i));
            i++;
            if (i >= content.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [content, speed]);

    return <div style={{whiteSpace: 'pre-wrap'}}>{displayedText}</div>;
};