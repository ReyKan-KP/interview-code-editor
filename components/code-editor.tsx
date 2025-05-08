"use client"

import { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Check, Maximize2, Minimize2, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  language?: string
  defaultValue?: string
  defaultTheme?: string
  height?: string
  width?: string
  onChange?: (value: string | undefined) => void
  className?: string
  readOnly?: boolean
}

export function CodeEditor({
  language = "javascript",
  defaultValue = "// Write your code here",
  defaultTheme = "vs-dark",
  height = "500px",
  width = "100%",
  onChange,
  className,
  readOnly = false,
}: CodeEditorProps) {
  const [theme, setTheme] = useState(defaultTheme)
  const [code, setCode] = useState(defaultValue)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // Update code when defaultValue changes
    setCode(defaultValue);
  }, [defaultValue]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "")
    if (onChange) {
      onChange(value)
    }
  }

  const themes = [
    { label: "Light", value: "vs", icon: Sun },
    { label: "Dark", value: "vs-dark", icon: Moon },
    { label: "High Contrast", value: "hc-black", icon: null },
  ]

  return (
    <Card className={cn(
      "relative bg-transparent text-white", 
      isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "",
      className
    )}>
      <div className="flex items-center justify-between gap-2 p-3 border-b">
        <div className="flex items-center gap-2">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select theme">
                {theme && (
                  <div className="flex items-center gap-2">
                    {theme === "vs" && <Sun className="h-4 w-4" />}
                    {theme === "vs-dark" && <Moon className="h-4 w-4" />}
                    <span>
                      {theme === "vs" ? "Light" : theme === "vs-dark" ? "Dark" : "High Contrast"}
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themes.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
                  <div className="flex items-center gap-2">
                    {themeOption.icon && <themeOption.icon className="h-4 w-4" />}
                    <span>{themeOption.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" 
                className="bg-gray-900 hover:bg-gray-800"
                size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-green-500 hover:text-green-600" /> : <Copy className="h-4 w-4 text-white hover:text-gray-500" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <TooltipP/ */}
        </div>
      </div>
      <CardContent className="p-0">
        <Editor
          height={isFullscreen ? "calc(100vh - 60px)" : height}
          width={width}
          language={language}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: readOnly,
            wordWrap: "on",
          }}
          className="rounded-b-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  )
}
