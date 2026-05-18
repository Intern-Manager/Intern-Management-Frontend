import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="bg-white/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-container-margin py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-base">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary">InternHub IMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden lg:block px-6 py-2.5 rounded-lg border border-outline font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-background">
        <section className="relative pt-20 pb-32 overflow-hidden px-container-margin max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Trusted by Fortune 500 Companies
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
                Empowering the Next Generation of <span className="text-primary">Talent</span>.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
                The ultimate enterprise-grade intern management system designed to streamline recruitment, automate roadmaps, and measure impact in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/campaigns" className="px-8 py-4 rounded-xl primary-gradient text-white font-label-md text-label-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center justify-center">
                  Browse Open Internships
                </Link>
                <button className="px-8 py-4 rounded-xl bg-white border border-outline text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Showcase
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="glass-card p-4 rounded-3xl relative overflow-hidden group shadow-lg">
                <img
                  alt="IMS Dashboard Preview"
                  className="rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB_O9sancccf3S1Rnrt5ySvIYtTOddYh_GfxfglP4MQNdeipn3YJFzvdCZrj_unK6bnuILhrAsS9l__QLDpI7wWAoaXC7fK_MGyzGSAG3LBO89jjWnN07o5rDM0-3QU3uwzHFZfsu4y5tY1gQv3Fw7DhVr_Rb0_UPglnsL5Ds8ehRj1N7vmT2CiBAgE8X92hOxtdnIqZxRi5cpZUVFeLyGXDWn0vrLjOqCVnkUYBrj6PSlGCJv5chhrI8FL7kgYamm-F7Wevwmnhs"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-surface border-y border-outline-variant/20 px-container-margin">
          <div className="max-w-7xl mx-auto">
            <p className="text-center font-label-sm text-label-sm text-on-surface-variant mb-10 uppercase tracking-widest">Powering Innovation At</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-40 hover:opacity-70 transition-opacity duration-300">
              <div className="font-headline-md font-bold text-on-surface">TECHCORP</div>
              <div className="font-headline-md font-bold text-on-surface">GLOBOBANK</div>
              <div className="font-headline-md font-bold text-on-surface">VIVIDSTARS</div>
              <div className="font-headline-md font-bold text-on-surface">QUANTUM</div>
              <div className="font-headline-md font-bold text-on-surface">STRATOS</div>
            </div>
          </div>
        </section>

        <section className="py-24 px-container-margin max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">One Platform. Five Specialized Modules.</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Tailored experiences for every stakeholder in your internship ecosystem, ensuring seamless collaboration and oversight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-3 glass-card rounded-3xl p-widget-padding flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">person_search</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3">HR Manager</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Strategic oversight and headcount planning. Manage talent acquisition pipelines and high-level ROI reporting.</p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="material-symbols-outlined text-outline transform group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
            <div className="md:col-span-3 glass-card rounded-3xl p-widget-padding flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Program Coordinator</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Operational excellence. Handle onboarding, scheduling, and logistics across multiple internship tracks.</p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="material-symbols-outlined text-outline transform group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
            <div className="md:col-span-2 glass-card rounded-3xl p-widget-padding flex flex-col group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-2 font-bold">Mentor Module</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Guided performance reviews and structured feedback loops for senior staff.</p>
            </div>
            <div className="md:col-span-2 glass-card rounded-3xl p-widget-padding flex flex-col group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">school</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-2 font-bold">Intern Portal</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Gamified learning paths, task management, and community engagement features.</p>
            </div>
            <div className="md:col-span-2 glass-card rounded-3xl p-widget-padding flex flex-col group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-2 font-bold">Global Admin</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Full system configuration, security logs, and multi-tenant management.</p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface border-y border-outline-variant/20 px-container-margin">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-gutter">
              <div className="p-widget-padding bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-4">Recruitment Pipeline</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Automate candidate screening with AI-driven matching and structured interview workflows.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    Visual Kanban Boards
                  </li>
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    Automated Email Triggers
                  </li>
                </ul>
              </div>
              <div className="p-widget-padding bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-4">Training Roadmaps</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Design customizable learning paths with milestones, skill tracking, and certifications.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    Dynamic Skill Mapping
                  </li>
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    Interactive LMS Integration
                  </li>
                </ul>
              </div>
              <div className="p-widget-padding bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-4">Real-time Analytics</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Gain actionable insights into program performance with deep-dive data visualization.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    ROI Impact Dashboards
                  </li>
                  <li className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    Exportable Executive Reports
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-container-margin max-w-7xl mx-auto">
          <div className="glass-card rounded-[40px] p-12 overflow-hidden relative">
            <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-24"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center z-10 relative">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Enterprise-Grade Security & Scalability</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                  We understand the complexities of global talent management. InternHub IMS is built on a foundation of trust, compliance, and limitless growth.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">security</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">SOC2 & GDPR Compliant</h5>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Your data is protected by the highest industry security standards and end-to-end encryption.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">cloud_done</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">99.9% Uptime SLA</h5>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Reliable infrastructure that scales from 10 to 10,000 interns without breaking a sweat.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">support_agent</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">24/7 Dedicated Support</h5>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">An expert success manager assigned to your account for seamless implementation.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center">
                <img
                  alt="Enterprise Security Illustration"
                  className="rounded-3xl shadow-xl max-w-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBryW5-hND_wZK1DUVK7lSLN3l_SIei3OK96q6-6W7tNOVqzpCdOV7cThSZMlUf7Y5IEghRuOyM-ncpl0Wbyu1VqqZxABxtMwrF3O9ZLnrWPXf-fazsGNMv2VZ9EsZqwO-2-DwLkAoxV8bme-W4YB47TxRHKViax4O1u8wZ1whx3MC2j_tU0nCKmYIG4SCHmAroenNZ3M-gJfRpFv-4_pfz4Y4ukJEMntCsy_x1NrsqaGEErzmlFvVa_EwuV_WY799N42IMrRlkp7g"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-container-margin text-center">
          <div className="max-w-4xl mx-auto glass-card p-16 rounded-[48px] primary-gradient text-white shadow-xl">
            <h2 className="font-display-lg text-display-lg mb-6">Ready to transform your talent program?</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-10">Join 500+ global enterprises who have scaled their internship programs by 40% using InternHub IMS.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 rounded-2xl bg-white text-primary font-label-md text-label-md shadow-lg hover:shadow-xl transition-all active:scale-95">Get Started Today</button>
              <button className="px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-label-md text-label-md hover:bg-white/10 transition-all active:scale-95">Schedule a Call</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface border-t border-outline-variant/20">
        <div className="w-full px-container-margin py-widget-padding flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-base">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">I</span>
              </div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">InternHub IMS</span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 InternHub IMS. Empowering the next generation of talent.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-gutter">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Security</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
