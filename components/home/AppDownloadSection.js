export default function AppDownloadSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Download DressStore App
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Get exclusive app-only offers, early access to sales, and amazing deals. Download now and get 20% OFF on your first order!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl px-8 py-4 text-white font-semibold transition-all border-2 border-white/30 hover:border-white/50 shadow-xl">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.523 15.341c-.44.637-.83 1.21-1.31 1.892-.66.944-1.21 1.66-2.42 1.66-1.18 0-1.55-.7-2.9-.7-1.37 0-1.8.71-2.9.73-1.14.02-1.83-.79-2.49-1.73-1.34-1.93-2.37-5.46-1-7.85.68-1.19 1.9-1.94 3.22-1.96 1.01-.02 1.96.67 2.57.67.61 0 1.75-.83 2.95-.71.5.02 1.9.2 2.8 1.51-.07.05-1.67 1-1.65 2.97.02 2.36 2.07 3.14 2.08 3.15z" />
                                <path d="M13.083 4.5c.48-.58.85-1.39.76-2.2-.73.03-1.61.49-2.13 1.1-.47.54-.88 1.4-.77 2.23.82.06 1.66-.42 2.14-1.13z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs text-white/80">Download on the</div>
                                <div className="text-lg font-bold">App Store</div>
                            </div>
                        </button>
                        <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl px-8 py-4 text-white font-semibold transition-all border-2 border-white/30 hover:border-white/50 shadow-xl">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35z" />
                                <path d="M16.81 15.12l-3.12-3.12 3.12-3.12 3.35 1.93c.56.33.91.89.91 1.5s-.35 1.17-.91 1.5l-3.35 1.93z" />
                                <path d="M13.69 12l-9.85-9.85c.24-.11.5-.15.76-.15.37 0 .73.11 1.05.31l10.61 6.12L13.69 12z" />
                                <path d="M13.69 12l2.57 2.57-10.61 6.12c-.32.2-.68.31-1.05.31-.26 0-.52-.04-.76-.15L13.69 12z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs text-white/80">Get it on</div>
                                <div className="text-lg font-bold">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
