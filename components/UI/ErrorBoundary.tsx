import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private getAndroidIntentLink = () => {
        try {
            const url = new URL(window.location.href);
            const urlNoScheme = url.toString().replace(/^https?:\/\//, '');
            const scheme = window.location.protocol.replace(':', '');
            return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
        } catch (e) {
            return '';
        }
    };

    public render() {
        if (this.state.hasError) {
            const isAndroid = /android/i.test(navigator.userAgent);

            return (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-6 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 my-auto">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-50 p-4 rounded-full">
                                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 text-center mb-4">
                            Something went wrong
                        </h2>

                        <p className="text-slate-600 text-center leading-relaxed mb-8">
                            The application encountered an error. This often happens in restricted in-app browsers. Please try opening this page in your main browser for the best experience.
                        </p>

                        <div className="flex flex-col gap-3">
                            {isAndroid ? (
                                <a
                                    href={this.getAndroidIntentLink()}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-200 transition-all active:scale-95"
                                >
                                    Open in Chrome
                                </a>
                            ) : (
                                <button
                                    onClick={() => alert('Please tap your browser menu and select "Open in Safari" or "Open in Browser".')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-200 transition-all active:scale-95"
                                >
                                    How to Open
                                </button>
                            )}

                            <button
                                onClick={() => window.location.reload()}
                                className="text-slate-400 hover:text-slate-600 font-medium py-2 transition-colors text-sm"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
