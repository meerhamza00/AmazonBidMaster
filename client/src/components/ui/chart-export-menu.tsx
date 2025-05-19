import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, Share2 } from "lucide-react";
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

interface ChartExportMenuProps {
  chartRef: React.RefObject<HTMLElement>;
  data: any[];
  filename: string;
  exportColumns: { key: string; label: string }[];
}

export function ChartExportMenu({
  chartRef,
  data,
  filename,
  exportColumns
}: ChartExportMenuProps) {
  const sanitizedFilename = `${filename.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

  const exportToPng = () => {
    if (chartRef.current) {
      toPng(chartRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          saveAs(dataUrl, `${sanitizedFilename}.png`);
        })
        .catch((error) => {
          console.error('Error exporting chart as PNG:', error);
        });
    }
  };

  const exportToJpeg = () => {
    if (chartRef.current) {
      toJpeg(chartRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          saveAs(dataUrl, `${sanitizedFilename}.jpeg`);
        })
        .catch((error) => {
          console.error('Error exporting chart as JPEG:', error);
        });
    }
  };

  const exportToCsv = () => {
    // Convert data to CSV format
    const headers = exportColumns.map(col => col.label);
    const keys = exportColumns.map(col => col.key);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => keys.map(key => {
        const value = row[key];
        // Handle strings with commas by wrapping in quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${sanitizedFilename}.csv`);
  };

  const copyToClipboard = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        
        // Show toast notification
        // toast({ title: "Chart copied to clipboard" });
      } catch (error) {
        console.error('Error copying chart to clipboard:', error);
        // toast({ title: "Failed to copy chart", variant: "destructive" });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPng}>
          <Image className="h-4 w-4 mr-2" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJpeg}>
          <Image className="h-4 w-4 mr-2" />
          Export as JPEG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCsv}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Share2 className="h-4 w-4 mr-2" />
          Copy to clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}