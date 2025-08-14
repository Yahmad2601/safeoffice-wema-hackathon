import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginStep1 from "@/components/auth/login-step-1";
import LoginStep2 from "@/components/auth/login-step-2";
import LoginStep3 from "@/components/auth/login-step-3";

export default function Login() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepComplete = (nextStep: number) => {
    if (nextStep > 3) {
      setLocation("/dashboard");
    } else {
      setCurrentStep(nextStep);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center space-x-2 mt-4">
      <div className={`w-8 h-1 rounded-full ${currentStep >= 1 ? 'bg-wema-purple' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-1 rounded-full ${currentStep >= 2 ? 'bg-wema-purple' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-1 rounded-full ${currentStep >= 3 ? 'bg-wema-purple' : 'bg-gray-200'}`}></div>
    </div>
  );

  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-10 h-10 wema-gradient rounded-lg flex items-center justify-center">
          <Shield className="text-white h-5 w-5" />
        </div>
        <span className="text-2xl font-bold text-gray-900">SAFE OFFICE</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Login</h2>
      <p className="text-gray-600">
        Step {currentStep} of 3: {
          currentStep === 1 ? "Enter your credentials" :
          currentStep === 2 ? "Enter the OTP sent to your device" :
          "Quick security verification"
        }
      </p>
      {renderStepIndicator()}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {renderHeader()}
            
            {currentStep === 1 && (
              <LoginStep1 
                onComplete={() => handleStepComplete(2)}
                onBack={() => setLocation("/")}
              />
            )}
            
            {currentStep === 2 && (
              <LoginStep2 
                onComplete={() => handleStepComplete(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <LoginStep3 
                onComplete={() => handleStepComplete(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 1 && (
              <div className="mt-6 text-center">
                <Link href="/">
                  <Button 
                    variant="link" 
                    className="text-wema-purple hover:text-wema-dark text-sm"
                    data-testid="link-back-home"
                  >
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
