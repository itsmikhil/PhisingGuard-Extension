import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, Lock, Zap, ChevronRight, Activity, Globe } from "lucide-react";
import { motion } from "motion/react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Phishing Guard</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                Sign in
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-blue-50/50 -skew-y-3 origin-top-left transform-gpu"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-8">
            <Activity className="w-4 h-4" />
            <span>AI-Powered Threat Detection</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Protect your organization from <span className="text-blue-600">advanced phishing</span> attacks.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real-time URL scanning, AI-driven threat analysis, and comprehensive dashboard reporting to keep your employees and data safe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 text-base h-14">
                Start Free Trial
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-14 bg-white/50 backdrop-blur-sm border-slate-300">
                View Live Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Enterprise-grade protection</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to secure your digital perimeter against sophisticated social engineering and credential harvesting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero-Day Detection</h3>
              <p className="text-slate-600 leading-relaxed">Our AI models identify previously unseen phishing campaigns in real-time, blocking threats before they reach your inbox.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Global Threat Intel</h3>
              <p className="text-slate-600 leading-relaxed">Connected to a worldwide network of threat feeds, continuously updating our blocking rules globally.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant URL Scan</h3>
              <p className="text-slate-600 leading-relaxed">Suspicious links are analyzed in milliseconds, checking domain age, SSL certificates, and hidden redirects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl text-white">Phishing Guard</span>
            </div>
            <p className="max-w-sm mb-6">Securing the modern web against sophisticated threats using state-of-the-art AI detection.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Phishing Guard Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
