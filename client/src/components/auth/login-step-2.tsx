import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Check } from "lucide-react";

interface LoginStep2Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function LoginStep2({ onComplete, onBack }: LoginStep2Props) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const otpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { otp });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "OTP Verified",
        description: "Proceeding to security verification...",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      // Clear OTP inputs on error
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all 6 digits are entered
    if (newOtpValues.every(val => val !== "") && index === 5) {
      const otp = newOtpValues.join("");
      otpMutation.mutate(otp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otp = otpValues.join("");
    if (otp.length === 6) {
      otpMutation.mutate(otp);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits.",
        variant: "destructive",
      });
    }
  };

  const resendOTP = useMutation({
    mutationFn: async () => {
      // Simulate resend OTP API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: "OTP sent successfully" };
    },
    onSuccess: () => {
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your device.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-gray-600">OTP sent to ***-***-1234</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter 6-digit OTP</label>
        <div className="flex justify-center space-x-3">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold"
              data-testid={`input-otp-${index}`}
            />
          ))}
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full bg-wema-purple hover:bg-wema-dark"
        disabled={otpMutation.isPending || otpValues.some(val => val === "")}
        data-testid="button-verify-otp"
      >
        {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="mt-6 text-center space-y-2">
        <Button 
          variant="link" 
          onClick={() => resendOTP.mutate()}
          disabled={resendOTP.isPending}
          className="text-wema-purple hover:text-wema-dark text-sm"
          data-testid="button-resend-otp"
        >
          {resendOTP.isPending ? "Sending..." : "Resend OTP"}
        </Button>
        <br />
        <Button 
          variant="link" 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm"
          data-testid="button-back-login"
        >
          ← Back to Login
        </Button>
      </div>
    </div>
  );
}
