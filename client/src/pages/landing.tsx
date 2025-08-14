import { Link } from "wouter";
import { Shield, ShieldQuestion, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/images/safe_office_avatar.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 wema-gradient rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-4 w-4" />
                </div>
                <span className="text-xl font-bold text-gray-900">SAFE OFFICE</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#security" className="text-gray-600 hover:text-wema-purple transition-colors">
                Security
              </a>
              <a href="#features" className="text-gray-600 hover:text-wema-purple transition-colors">
                Features
              </a>
              <a href="#support" className="text-gray-600 hover:text-wema-purple transition-colors">
                Support
              </a>
              <Link href="/login">
                <Button 
                  className="bg-wema-purple hover:bg-wema-dark text-white"
                  data-testid="button-employee-login"
                >
                  Employee Login
                </Button>
              </Link>
            </div>
            <button className="md:hidden" data-testid="button-menu-mobile">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="wema-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                  Secure Banking
                  <span className="block text-purple-200">From Anywhere</span>
                </h1>
                <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                  SAFE OFFICE provides a zero-trust security framework for remote banking employees. 
                  Access sensitive data and perform critical operations with confidence, from any location.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button 
                      className="bg-white text-wema-purple hover:bg-gray-100"
                      size="lg"
                      data-testid="button-access-dashboard"
                    >
                      Access Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="bg-white text-wema-purple hover:bg-gray-100"
                    size="lg"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              {/* Professional banking illustration */}
              <div className="hidden lg:block">
                <img 
                  src={avatar}
                  alt="Professional banking technology" 
                  className="rounded-2xl w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with zero-trust architecture to protect sensitive banking operations in a distributed workforce.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Factor Authentication</h3>
              <p className="text-gray-600">Advanced authentication including biometric verification and behavioral analysis.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Behavioral Biometrics</h3>
              <p className="text-gray-600">Verify user authenticity via user's behavioral patterns powered by LLM</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Monitoring</h3>
              <p className="text-gray-600">Continuous monitoring of user behavior and system access patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 wema-gradient rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-4 w-4" />
                </div>
                <span className="text-xl font-bold">SAFE OFFICE</span>
              </div>
              <p className="text-gray-400">Securing the future of remote banking operations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Zero Trust</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
                <li><a href="#" className="hover:text-white">Audit Logs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Powered by</h4>
              <p className="text-gray-400">Wema Bank Innovation Team</p>
              <p className="text-gray-400 mt-2">© 2024 SAFE OFFICE</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
