import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Search, FileCode, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DocumentSanitizerProps {
  fileName: string;
  onComplete: () => void;
}

const steps = [
  { text: "Analyzing document structure...", icon: Search },
  { text: "Scanning for hidden scripts and malware...", icon: ShieldCheck },
  { text: "Stripping potentially harmful metadata...", icon: FileCode },
  { text: "Converting to secure view-only format...", icon: CheckCircle },
  { text: "Sanitization complete!", icon: CheckCircle },
];

export default function DocumentSanitizer({ fileName, onComplete }: DocumentSanitizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        setTimeout(onComplete, 500); // Wait half a second before showing the document
        return prev;
      });
    }, 1000); // 1 second per step

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 100));
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sanitizing Document</h2>
          <p className="text-sm text-gray-600 mb-6 truncate">{fileName}</p>
          
          <div className="relative h-24 w-24 mx-auto mb-6 flex items-center justify-center">
            <CurrentIcon className="w-20 h-20 text-wema-purple animate-pulse" />
          </div>

          <Progress value={progress} className="w-full mb-4" />
          
          <p className="text-sm font-medium text-gray-700 h-5">
            {steps[currentStep].text}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
