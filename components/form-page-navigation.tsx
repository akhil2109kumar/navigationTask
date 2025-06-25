"use client"

import React, { useState, useRef, useCallback } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Flag, Edit2, Copy, Files, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DragStart } from "@hello-pangea/dnd"

interface FormPage {
  id: string
  name: string
  icon: "circle" | "document" | "circle-check"
}

const initialPages: FormPage[] = [
  { id: "1", name: "Info", icon: "circle" },
  { id: "2", name: "Details", icon: "document" },
  { id: "3", name: "Other", icon: "document" },
  { id: "4", name: "Ending", icon: "circle-check" },
]

export function FormPageNavigation() {
  const [pages, setPages] = useState<FormPage[]>(initialPages)
  const [activePage, setActivePage] = useState("1")
  const [hoveredAddButton, setHoveredAddButton] = useState<number | null>(null)
  const [hoveredPage, setHoveredPage] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const nextIdRef = useRef(5)

  const handleDragStart = useCallback((start: DragStart) => {
    setDraggedItem(start.draggableId)
  }, [])

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      setDraggedItem(null)

      if (!result.destination) {
        return
      }

      const items = Array.from(pages)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      setPages(items)
    },
    [pages],
  )

  const addPage = useCallback(
    (afterIndex: number) => {
      const newPage: FormPage = {
        id: nextIdRef.current.toString(),
        name: `Page ${nextIdRef.current}`,
        icon: "document",
      }
      nextIdRef.current++

      const newPages = [...pages]
      newPages.splice(afterIndex + 1, 0, newPage)
      setPages(newPages)
      setActivePage(newPage.id) // Auto-select the new page
    },
    [pages],
  )

  const addPageAtEnd = useCallback(() => {
    const newPage: FormPage = {
      id: nextIdRef.current.toString(),
      name: `Page ${nextIdRef.current}`,
      icon: "document",
    }
    nextIdRef.current++
    setPages([...pages, newPage])
    setActivePage(newPage.id) // Auto-select the new page
  }, [pages])

  const getPageIcon = (icon: FormPage["icon"], isActive: boolean) => {
    const className = `w-4 h-4 ${isActive ? "text-orange-500" : "text-gray-400"}`

    switch (icon) {
      case "circle":
        return (
          <div
            className={`w-4 h-4 rounded-full border-2 ${isActive ? "border-orange-500 bg-orange-500" : "border-gray-400"}`}
          />
        )
      case "circle-check":
        return (
          <div
            className={`w-4 h-4 rounded-full border-2 ${isActive ? "border-orange-500 bg-orange-500" : "border-gray-400"} flex items-center justify-center`}
          >
            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
        )
      case "document":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="pages" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex items-center gap-1 p-4 bg-gray-50 rounded-lg border overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-w-0"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="flex items-center gap-1 min-w-max">
                {pages.map((page, index) => (
                  <React.Fragment key={page.id}>
                    <Draggable draggableId={page.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
            group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 relative
            ${
              activePage === page.id
                ? "bg-orange-50 border border-orange-200 text-orange-700 shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }
            ${draggedItem === page.id ? "opacity-50" : ""}
          `}
                          onClick={() => setActivePage(page.id)}
                          onMouseEnter={() => setHoveredPage(page.id)}
                          onMouseLeave={() => setHoveredPage(null)}
                        >
                          {getPageIcon(page.icon, activePage === page.id)}
                          <span className="text-sm font-medium select-none">{page.name}</span>

                          {/* Context menu - visible on hover or when active */}
                          <div
                            className={`transition-opacity duration-200 ${
                              hoveredPage === page.id || activePage === page.id ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-5 h-5 p-0 hover:bg-gray-200 ml-1 rounded-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Flag className="w-4 h-4 text-blue-500" />
                                  Set as first page
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Edit2 className="w-4 h-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Files className="w-4 h-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}
                    </Draggable>

                    {/* Dotted connector line with hover-to-add functionality */}
                    {index < pages.length - 1 && (
                      <div
                        className="relative flex items-center justify-center px-2"
                        onMouseEnter={() => setHoveredAddButton(index)}
                        onMouseLeave={() => setHoveredAddButton(null)}
                      >
                        {/* Dotted line */}
                        <div className="w-6 h-px border-t border-dashed border-gray-300" />

                        {/* Plus button that appears on hover - matches screenshot */}
                        {hoveredAddButton === index && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute w-5 h-5 p-0 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-full shadow-sm z-10 transition-all duration-200"
                            onClick={() => addPage(index)}
                          >
                            <Plus className="w-3 h-3 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Final dotted line before "Add page" button */}
                <div className="flex items-center justify-center px-2">
                  <div className="w-6 h-px border-t border-dashed border-gray-300" />
                </div>

                {/* Add page button at the end */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-dashed border-gray-300 hover:border-gray-400 rounded-md transition-colors"
                  onClick={addPageAtEnd}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add page</span>
                </Button>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Debug info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current State:</h3>
        <p className="text-sm text-gray-600">Active Page: {pages.find((p) => p.id === activePage)?.name}</p>
        <p className="text-sm text-gray-600">Total Pages: {pages.length}</p>
        <p className="text-sm text-gray-600">Page Order: {pages.map((p) => p.name).join(" → ")}</p>
      </div>
    </div>
  )
}
