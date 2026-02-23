import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, FileText, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5"></div>
                    {/* Abstract medical cross pattern background */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
                        <Activity size={400} className="text-[var(--accent)]" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)] mb-6">
                        Advanced Care,<br />
                        <span className="text-[var(--accent)]">Simplified Access.</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-[var(--secondary)] mb-10">
                        Connecting patients with top-tier medical specialists through a secure, seamless digital health platform. Immediate scheduling, comprehensive records, and trusted professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent)] text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center w-full sm:w-auto"
                        >
                            Get Started as Patient
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-[var(--card)] border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-lg font-semibold text-lg transition-all shadow-md w-full sm:w-auto"
                        >
                            Access Portal
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-10 bg-[var(--primary)] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-medium uppercase tracking-widest text-[var(--secondary)] mb-6">
                        Trusted by the Medical Community
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
                        <div className="flex items-center text-xl font-bold"><Shield className="mr-2 h-6 w-6 text-[var(--accent)]" /> HIPAA COMPLIANT</div>
                        <div className="flex items-center text-xl font-bold"><CheckCircle2 className="mr-2 h-6 w-6 text-[var(--accent)]" /> 500+ SPECIALISTS</div>
                        <div className="flex items-center text-xl font-bold"><Activity className="mr-2 h-6 w-6 text-[var(--accent)]" /> 24/7 AVAILABILITY</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[var(--card)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl text-balance">
                            Designed for Clinical Excellence
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--secondary)] text-balance">
                            Medicare 2.0 bridges the gap between patient needs and provider availability with state-of-the-art tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-[var(--background)] rounded-xl p-8 medical-shadow medical-card-hover border border-[var(--card-border)]">
                            <div className="bg-[var(--accent)]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <Clock className="h-7 w-7 text-[var(--accent)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Instant Scheduling</h3>
                            <p className="text-[var(--secondary)] leading-relaxed">
                                Atomic slot isolation directly from physician availability calendars. Eliminate double-bookings and secure your consultation instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[var(--background)] rounded-xl p-8 medical-shadow medical-card-hover border border-[var(--card-border)]">
                            <div className="bg-[var(--primary)]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <FileText className="h-7 w-7 text-[var(--primary)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Unified Medical Records</h3>
                            <p className="text-[var(--secondary)] leading-relaxed">
                                Upload and manage prescriptions and diagnostic reports securely in the cloud. Instantly share history with your physician.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[var(--background)] rounded-xl p-8 medical-shadow medical-card-hover border border-[var(--card-border)]">
                            <div className="bg-[var(--accent)]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-[var(--accent)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Role-Based Security</h3>
                            <p className="text-[var(--secondary)] leading-relaxed">
                                Strict access control ensures Doctors only see their patients, while Patients retain full ownership over their personal health data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Footer */}
            <footer className="mt-auto bg-[var(--background)] border-t border-[var(--card-border)] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-[var(--primary)] text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-lg mr-2">M</div>
                        <span className="text-xl font-extrabold text-[var(--primary)] tracking-tight">MEDICARE <span className="text-[var(--accent)]">2.0</span></span>
                    </div>
                    <div className="flex space-x-6 mb-6">
                        <a href="#" className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors">Emergency Protocol</a>
                        <a href="#" className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors">Provider Network</a>
                        <a href="#" className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors">Privacy Shield</a>
                    </div>
                    <p className="text-[var(--secondary)] text-sm text-center">
                        &copy; {new Date().getFullYear()} Medicare Digital Infrastructure. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
