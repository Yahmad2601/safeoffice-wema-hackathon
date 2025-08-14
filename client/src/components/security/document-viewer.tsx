import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Download, X } from 'lucide-react';

interface DocumentViewerProps {
  title: string;
  content: string;
  employeeName: string;
  onClose: () => void;
}

export default function DocumentViewer({ title, content, employeeName, onClose }: DocumentViewerProps) {
  const [openTime] = useState(new Date());
  const [userIP, setUserIP] = useState('192.168.1.100'); // Demo IP

  useEffect(() => {
    // Fetch user's IP address (using demo data)
    setUserIP(`192.168.1.${Math.floor(Math.random() * 254) + 1}`);

    // Security measures
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, PrintScreen, etc.
      if (
        e.ctrlKey && (e.key === 's' || e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x') ||
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventDragStart = (e: DragEvent) => e.preventDefault();
    const preventSelectStart = (e: Event) => e.preventDefault();

    // Apply security measures
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    document.addEventListener('dragstart', preventDragStart);
    document.addEventListener('selectstart', preventSelectStart);

    // Disable developer tools detection
    const devToolsCheck = () => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        document.body.innerHTML = '<div style="padding: 50px; text-align: center;"><h1>Access Restricted</h1><p>Developer tools detected. Document access has been revoked for security reasons.</p></div>';
      }
    };
    
    const devToolsInterval = setInterval(devToolsCheck, 1000);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('dragstart', preventDragStart);
      document.removeEventListener('selectstart', preventSelectStart);
      clearInterval(devToolsInterval);
    };
  }, []);

  const watermarkText = `${employeeName} | ${openTime.toLocaleString()} | IP: ${userIP}`;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="document-viewer-overlay">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative overflow-hidden">
        {/* Diagonal Watermarks */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute text-gray-300/20 text-sm font-bold whitespace-nowrap"
              style={{
                transform: `rotate(-45deg)`,
                top: `${(i % 5) * 20 + 10}%`,
                left: `${Math.floor(i / 5) * 25}%`,
                transformOrigin: 'center',
              }}
            >
              {watermarkText}
            </div>
          ))}
        </div>

        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b bg-purple-50">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">SANDBOX VIEWER</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-document"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Security Notice */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex items-center">
            <Eye className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-sm text-red-700">
              <strong>CONFIDENTIAL DOCUMENT</strong> - This document is protected. 
              Right-click, copy, save, and screenshot functions are disabled. 
              Access logged: {employeeName} at {openTime.toLocaleString()} from IP {userIP}
            </p>
          </div>
        </div>

        {/* Document Content */}
        <CardContent className="flex-1 overflow-auto p-6 relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-900" data-testid="text-document-title">{title}</h2>
          
          <div 
            className="prose max-w-none text-gray-800 leading-relaxed select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
            data-testid="text-document-content"
          >
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom watermark */}
          <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
            Document accessed by {employeeName} on {openTime.toLocaleString()} | IP: {userIP} | WEMA BANK CONFIDENTIAL
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Document Security: MAXIMUM</span>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            data-testid="button-close-document-footer"
          >
            Close Document
          </Button>
        </div>
      </div>
    </div>
  );
}