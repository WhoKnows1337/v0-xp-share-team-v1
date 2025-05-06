"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface CollapsibleCardProps {
  title: string
  children: React.ReactNode
  defaultCollapsed?: boolean
  id: string
}

export function CollapsibleCard({ title, children, defaultCollapsed = false, id }: CollapsibleCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isClient, setIsClient] = useState(false)

  // Setze isClient auf true, wenn die Komponente auf dem Client gerendert wird
  useEffect(() => {
    setIsClient(true)

    // Lade den gespeicherten Zustand aus dem localStorage
    const savedState = localStorage.getItem(`card-${id}-collapsed`)
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [id])

  // Speichere den Zustand im localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(`card-${id}-collapsed`, isCollapsed.toString())
    }
  }, [isCollapsed, id, isClient])

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <GripVertical className="h-5 w-5 text-slate-500 mr-2 cursor-move" />
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-4 pt-2">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
