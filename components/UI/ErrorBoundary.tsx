import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
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

    private copyDebugInfo = () => {
        const { error, errorInfo } = this.state;
        const debugText = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
        `.trim();

        navigator.clipboard.writeText(debugText).then(() => {
            alert('Diagnostic information copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy error info: ', err);
            alert('Failed to copy. Please see console for details.');
        });
    };

    public render() {
        if (this.state.hasError) {
            const isAndroid = /android/i.test(navigator.userAgent);
            const { error, errorInfo } = this.state;

            return (
                <div className="fixed inset-0 z-1000 flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 my-auto">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-50 p-4 rounded-full">
                                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-slate-900 text-center mb-3">
                            Something went wrong
                        </h2>

                        <p className="text-slate-600 text-center text-sm leading-relaxed mb-6">
                            The application encountered an error. This often happens in restricted in-app browsers. Please try opening this page in your main browser for the best experience.
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            {isAndroid ? (
                                <a
                                    href={this.getAndroidIntentLink()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl text-center shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
                                >
                                    Open in Chrome
                                </a>
                            ) : (
                                <button
                                    onClick={() => alert('Please tap your browser menu and select "Open in Safari" or "Open in Browser".')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl text-center shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
                                >
                                    How to Open
                                </button>
                            )}

                            <button
                                onClick={() => window.location.reload()}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl text-center transition-all active:scale-95 text-sm"
                            >
                                Reload Page
                            </button>
                        </div>

                        {/* Debug Info Section */}
                        <div className="border-t border-slate-100 pt-6">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider">
                                    <span>Technical Details</span>
                                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-4 text-left">
                                    <div className="bg-slate-50 p-3 rounded-xl mb-3 overflow-x-auto">
                                        <p className="text-xs font-mono text-red-600 font-bold mb-1">
                                            {error?.name}: {error?.message}
                                        </p>
                                        <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap leading-tight">
                                            {error?.stack?.split('\n').slice(1, 4).join('\n')}
                                            {error?.stack && error.stack.split('\n').length > 4 && "\n..."}
                                        </pre>
                                    </div>
                                    <button 
                                        onClick={this.copyDebugInfo}
                                        className="w-full text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy Diagnostic Data
                                    </button>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
