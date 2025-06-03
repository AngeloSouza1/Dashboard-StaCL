"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { SheetData } from "../services/googleSheetsService"

interface FilteredDataContextType {
  filteredData: SheetData[]
  setFilteredData: (data: SheetData[]) => void
}

const FilteredDataContext = createContext<FilteredDataContextType | undefined>(undefined)

export const FilteredDataProvider = ({ children }: { children: ReactNode }) => {
  const [filteredData, setFilteredData] = useState<SheetData[]>([])

  return (
    <FilteredDataContext.Provider value={{ filteredData, setFilteredData }}>
      {children}
    </FilteredDataContext.Provider>
  )
}

export const useFilteredData = () => {
  const context = useContext(FilteredDataContext)
  if (!context) {
    throw new Error("useFilteredData must be used within a FilteredDataProvider")
  }
  return context
}
