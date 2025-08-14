import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, File as FileIcon, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SanitizedDocumentViewer from './sanitized-document-viewer';
import DocumentSanitizer from './document-sanitizer';
import { useQuery } from '@tanstack/react-query';

export default function DocumentUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileToSanitize, setFileToSanitize] = useState<File | null>(null);
  const [sanitizedFile, setSanitizedFile] = useState<File | null>(null);
  const { data: employee } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => ({ name: 'John Adebayo' }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      if (newFiles.length > 0) {
        setFileToSanitize(newFiles[0]);
      }
    }
  };

  const onSanitizeComplete = () => {
    setSanitizedFile(fileToSanitize);
    setFileToSanitize(null);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Drag & drop files here, or click to select files</p>
            <Input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} accept=".pdf" />
            <Button asChild className="mt-4">
              <label htmlFor="file-upload">Select Files</label>
            </Button>
          </div>
          <div className="mt-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setFileToSanitize(file)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {fileToSanitize && (
        <DocumentSanitizer 
          fileName={fileToSanitize.name}
          onComplete={onSanitizeComplete}
        />
      )}

      {sanitizedFile && (
        <SanitizedDocumentViewer 
          fileName={sanitizedFile.name}
          employeeName={employee?.name || "Employee"}
          onClose={() => setSanitizedFile(null)}
        />
      )}
    </>
  );
}
