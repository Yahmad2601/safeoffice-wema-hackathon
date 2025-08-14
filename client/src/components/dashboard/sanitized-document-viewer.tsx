import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';
import SanitizedDocImage from '@/assets/images/pdfConvert.png';

interface SanitizedDocumentViewerProps {
  fileName: string;
  employeeName: string;
  onClose: () => void;
}

export default function SanitizedDocumentViewer({ fileName, employeeName, onClose }: SanitizedDocumentViewerProps) {
  const openTime = new Date();
  const userIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
  const watermarkText = `${employeeName} | ${openTime.toLocaleString()} | IP: ${userIP}`;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-purple-50">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">Sandbox Viewer</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-6 relative">
          <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <img 
              src={SanitizedDocImage} 
              alt={`Sanitized view of ${fileName}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <p className="text-gray-900/10 text-xs font-bold transform -rotate-45 select-none">{watermarkText}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
