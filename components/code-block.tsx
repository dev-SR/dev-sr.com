"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Copy, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { unified } from 'unified'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { Fira_Code } from 'next/font/google'
const fireCode = Fira_Code({ subsets: ['latin'] })

import {
    transformerNotationDiff,
    transformerNotationFocus,
    transformerNotationErrorLevel
} from '@shikijs/transformers'

interface MultiFileCodeBlockProps {
    files: Array<{
        filename: string
        language?: string
        content: string
        highlightLines?: number[]
    }>
    title?: string
}

export function MultiFileCodeBlock({ files, title }: MultiFileCodeBlockProps) {
    const [activeTab, setActiveTab] = useState(files[0]?.filename)
    const [copied, setCopied] = useState<string | null>(null)
    const [highlightedContents, setHighlightedContents] = useState<string[]>([])

    const copyToClipboard = async (content: string, filename: string) => {
        await navigator.clipboard.writeText(content)
        setCopied(filename)
        setTimeout(() => setCopied(null), 2000)
    }

    useEffect(() => {
        const processFiles = async () => {
            const promises = files.map(async (file) => {
                let meta = ''
                if (file.highlightLines && file.highlightLines.length > 0) {
                    meta = ` {${file.highlightLines.join(',')}}`
                }
                const md = `\`\`\`${file.language || 'plaintext'}${meta}\n${file.content}\n\`\`\``
                const fileResult = await unified()
                    .use(remarkParse)
                    .use(remarkRehype)
                    .use(rehypePrettyCode, {
                        theme: 'dracula',
                        keepBackground: false,
                        transformers: [transformerNotationDiff(), transformerNotationFocus(),transformerNotationErrorLevel()],
                    })
                    .use(rehypeStringify)
                    .process(md)
                return String(fileResult)
            })
            const results = await Promise.all(promises)
            setHighlightedContents(results)
        }
        processFiles()
    }, [files])

    return (
        <div className="my-6">
            {title && <h4 className="text-lg font-semibold text-foreground mb-4">{title}</h4>}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="bg-muted/50 border border-border rounded-t-lg">
                    <TabsList className="h-auto p-1 bg-transparent">
                        {files.map((file) => (
                            <TabsTrigger
                                key={file.filename}
                                value={file.filename}
                                className="data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-border rounded-md px-3 py-2 text-sm"
                            >
                                {file.filename}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {files.map((file, index) => (
                    <TabsContent key={file.filename} value={file.filename} className="mt-0">
                        <div className="group relative bg-card border-x border-b border-border rounded-b-lg overflow-hidden">
                            <div className="absolute top-2 right-2 z-10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(file.content, file.filename)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-background/80 hover:bg-background"
                                >
                                    {copied === file.filename ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                {highlightedContents[index] ? (
                                    <div  dangerouslySetInnerHTML={{ __html: highlightedContents[index] }} />
                                ) : (
                                    <pre className="p-4 text-sm leading-relaxed">
                                        <code className={`language-${file.language || "plaintext"} `}>{file.content}</code>
                                    </pre>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}