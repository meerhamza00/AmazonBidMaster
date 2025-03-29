import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Upload, FileText, Check, AlertCircle, FilePlus2, Download } from "lucide-react";
import { csvRowSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CsvUploadProps {
  onUploadComplete?: () => void;
}

export default function CsvUpload({ onUploadComplete }: CsvUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simulated progress
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        clearInterval(interval);
        progress = 95; // Cap at 95% until actual completion
      }
      setUploadProgress(Math.min(progress, 95));
    }, 200);
    return interval;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    setUploadStatus('uploading');
    
    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      const fileContent = await file.text();
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: fileContent })
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      // Complete the progress
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Update cached campaign data
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      
      toast({
        title: "Success",
        description: "Campaign data uploaded successfully",
      });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      
      toast({
        title: "Upload Error",
        description: "There was a problem with your file. Please check the format and try again.",
        variant: "destructive"
      });
      
      console.error('Error uploading file:', error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        if (uploadStatus !== 'error') {
          setFileName(null);
          setUploadProgress(0);
          setUploadStatus('idle');
        }
      }, 3000);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={cn(
      "w-full mb-8 transition-all duration-200",
      isDragOver && "ring-2 ring-primary ring-offset-2"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Upload Campaign Data
        </CardTitle>
        <CardDescription>
          Upload your Amazon campaign data in CSV format to analyze performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20",
            isUploading ? "pointer-events-none opacity-80" : "cursor-pointer"
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!isUploading && !fileName ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Drag & Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FilePlus2 className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={cn(
                "mx-auto w-16 h-16 rounded-full flex items-center justify-center",
                uploadStatus === 'success' ? "bg-green-100" : 
                uploadStatus === 'error' ? "bg-red-100" : "bg-primary/10"
              )}>
                {uploadStatus === 'success' ? (
                  <Check className="h-8 w-8 text-green-500" />
                ) : uploadStatus === 'error' ? (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <div className="animate-pulse">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
              
              {fileName && (
                <div>
                  <p className="text-lg font-medium mb-1">
                    {uploadStatus === 'success' 
                      ? 'Upload Complete!' 
                      : uploadStatus === 'error'
                      ? 'Upload Failed'
                      : 'Uploading...'}
                  </p>
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                </div>
              )}
              
              {isUploading && (
                <div className="w-full max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(uploadProgress)}%</p>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                    setUploadStatus('idle');
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="csv-upload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleInputChange}
        />
      </CardContent>
      <CardFooter className="text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between border-t pt-4">
        <div className="flex items-center space-x-4 text-xs">
          <div>Supported format: CSV</div>
          <div>Maximum file size: 5MB</div>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="/src/assets/amazon_ppc_template.csv"
                  download="amazon_ppc_template.csv"
                  className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download CSV Template
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download a sample template with the correct format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}