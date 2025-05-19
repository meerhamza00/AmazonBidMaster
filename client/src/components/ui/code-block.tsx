import React, { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  title,
  className,
  maxHeight = '400px',
}: CodeBlockProps) {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split code into lines for line numbers
  const codeLines = code.split('\n');

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200",
      className
    )}>
      {title && (
        <div className={cn(
          "px-4 py-2 border-b flex items-center justify-between",
          isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              language === 'javascript' || language === 'js' || language === 'jsx' || language === 'ts' || language === 'tsx' 
                ? "bg-yellow-400" 
                : language === 'python' || language === 'py'
                ? "bg-blue-400"
                : language === 'html'
                ? "bg-orange-400"
                : language === 'css'
                ? "bg-blue-500"
                : language === 'json'
                ? "bg-green-400"
                : "bg-gray-400"
            )} />
            <span className="text-xs font-medium">{title}</span>
          </div>
          <div className="text-xs text-muted-foreground">{language}</div>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <div 
          className={cn(
            "overflow-auto font-mono text-sm",
            isDark ? "bg-zinc-900" : "bg-zinc-50"
          )}
          style={{ maxHeight }}
        >
          <pre className="p-4">
            <code>
              {showLineNumbers ? (
                <table className="border-collapse">
                  <tbody>
                    {codeLines.map((line, i) => (
                      <tr key={i} className="leading-relaxed">
                        <td className={cn(
                          "pr-4 select-none text-right",
                          isDark ? "text-zinc-600" : "text-zinc-400"
                        )}>
                          {i + 1}
                        </td>
                        <td className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                          {line || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                  {code}
                </div>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}