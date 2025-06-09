import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {useUrlChange} from './hooks/useUrlChange';
import {DetailModal} from './modal/DetailModal.jsx';

const IFRAME_ID = 'content-iframe';
const TOGGLE_ACTION = 'toggle-content';

const createIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('public/index.html');
    iframe.id = IFRAME_ID;
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
        display: 'none',
    });
    document.body.appendChild(iframe);
    return iframe;
};

const createToggleButton = () => {
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
        const iframe = document.getElementById(IFRAME_ID);
        const isHidden = iframe.style.display === 'none';
        iframe.style.display = isHidden ? 'flex' : 'none';
        iframe.contentWindow?.postMessage({action: TOGGLE_ACTION}, '*');
    });

    document.body.appendChild(button);
};

const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [predictionResult, setPredictionResult] = useState({});

    useUrlChange((nowPage) => {
        const iframe = document.getElementById(IFRAME_ID);
        iframe?.contentWindow?.postMessage({
            action: 'ANNOUNCE_NOW_PAGE',
            payload: nowPage,
        }, '*');
    });

    useEffect(() => {
        const iframe = createIframe();
        createToggleButton();

        const messageHandler = (event) => {
            const {action, payload, index} = event.data || {};
            const iframe = document.getElementById(IFRAME_ID);
            if (!iframe) return;

            switch (action) {
                case 'REQUEST_DOM': {
                    const fullHtml = document.documentElement.outerHTML;
                    iframe.contentWindow?.postMessage({action: 'SEND_DOM', payload: fullHtml}, '*');
                    break;
                }
                case 'MINIMIZE': {
                    const isHidden = iframe.style.display === 'none';
                    iframe.style.display = isHidden ? 'flex' : 'none';
                    iframe.contentWindow?.postMessage({action: TOGGLE_ACTION}, '*');
                    break;
                }
                case 'FOCUS_REVIEW': {
                    const reviews = document.querySelectorAll(
                        '.sdp-review__article__list__review__content.js_reviewArticleContent'
                    );
                    const target = reviews?.[index];
                    if (target) {
                        target.scrollIntoView({behavior: 'smooth', block: 'center'});
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                    break;
                }
                case 'OPEN_MODAL': {
                    setPredictionResult(payload.result);
                    iframe.style.visibility = 'hidden';
                    setShowModal(true);
                    break;
                }
                default:
                    break;
            }
        };

        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    const onClose = () => {
        setShowModal(false);
        const iframe = document.getElementById(IFRAME_ID);
        if (iframe) iframe.style.visibility = 'visible';
    };

    return showModal && <DetailModal predictionResult={predictionResult} onClose={onClose}/>;
};

// React 앱 mount
const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
ReactDOM.createRoot(mountPoint).render(<App/>);