import React, { useState, useEffect } from 'react';

export const BrowserSupportWarning: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const checkSupport = () => {
            const ua = navigator.userAgent.toLowerCase();
            const isInApp = ua.includes("wv") || ua.includes("webview") ||
                ua.includes("instagram") || ua.includes("facebook") ||
                ua.includes("line");

            const hasSpeech = 'speechSynthesis' in window;

            if (isInApp || !hasSpeech) {
                setIsVisible(true);
            }

            setIsAndroid(/android/i.test(ua));
        };

        checkSupport();
    }, []);

    const getAndroidIntentLink = () => {
        try {
            const url = new URL(window.location.href);
            const urlNoScheme = url.toString().replace(/^https?:\/\//, '');
            const scheme = window.location.protocol.replace(':', '');
            return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
        } catch (e) {
            console.error("Failed to generate intent link", e);
            return '';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-50 p-4 rounded-full">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 text-center mb-4">
                    Better in the Browser
                </h2>

                <p className="text-slate-600 text-center leading-relaxed mb-8">
                    It looks like you're using an in-app browser. For the best experience—including high-quality voice audio—please open this page in your main browser.
                </p>

                <div className="flex flex-col gap-3">
                    {isAndroid ? (
                        <a
                            href={getAndroidIntentLink()}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            Open in Chrome
                        </a>
                    ) : (
                        <button
                            onClick={() => alert('Please tap your browser menu and select "Open in Safari" or "Open in Browser" for full audio support.')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            How to Open
                        </button>
                    )}

                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-slate-400 hover:text-slate-600 font-medium py-2 transition-colors text-sm"
                    >
                        Continue anyway
                    </button>
                </div>
            </div>
        </div>
    );
};
