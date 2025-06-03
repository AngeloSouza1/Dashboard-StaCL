'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Zoom,
  useMediaQuery,
  Alert,
  Snackbar,
  Fab
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Menu as MenuIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import DataTable from './components/DataTable'
import ChartsSection from './components/ChartsSection'
import { GoogleSheetsService, type SheetData } from './services/googleSheetsService'
import { FilteredDataProvider } from './context/FilteredDataContext'
import { useFilteredData } from './context/FilteredDataContext'
import DashboardContent from './DashboardContent'




const DRAWER_WIDTH = 280

function DashboardContent() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [data, setData] = useState<SheetData[]>([])
  const { filteredData, setFilteredData } = useFilteredData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    clientes: [] as string[],
    rotas: [] as string[],
    produtos: [] as string[],
    dateRange: { start: null as Date | null, end: null as Date | null },
  })
  
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 300 })

  const handleDrawerToggle = () => {
    setSidebarOpen(prev => {
      const next = !prev
      localStorage.setItem('sidebarOpen', String(next))
      return next
    })
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const sheetsData = await GoogleSheetsService.fetchData()
      setData(sheetsData)
    } catch (err) {
      console.error(err)
      setError('Falha ao carregar dados do Google Sheets.')
    } finally {
      setLoading(false)
    }
  }


  const applyFilters = useCallback(() => {
    const { search, rota, produto, dateRange } = filters
    const filtered = data.filter(item => {
      const matchSearch = !search || item.cliente?.toLowerCase().includes(search.toLowerCase())
      const matchRota = !rota || item.rota?.toLowerCase().includes(rota.toLowerCase())
      const matchProd = !produto || item.produto?.toLowerCase().includes(produto.toLowerCase())
      const matchDate = !dateRange.start || !dateRange.end
        ? true
        : (() => {
            const d = new Date(item.data)
            return d >= dateRange.start! && d <= dateRange.end!
          })()
      return matchSearch && matchRota && matchProd && matchDate
    })
    setFilteredData(filtered)
  }, [data, filters])

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen')
    if (saved !== null) setSidebarOpen(saved === 'true')
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [data, filters])

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />
      <Sidebar
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
        isMobile={isMobile}
      />

      {!sidebarOpen && (
        <Fab
          color="primary"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1300,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ChartsSection data={filteredData} fullData={data} loading={loading} />
        </Box>

        <DataTable
          data={filteredData}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={loadData}
        />
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Zoom in={trigger}>
        <Fab
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1300,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
            backgroundColor: '#ff5722',
            color: 'white',
            '&:hover': {
              backgroundColor: '#e64a19',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  )
}

export default function Page() {
  return (
    <FilteredDataProvider>
      <DashboardContent />
    </FilteredDataProvider>
  )
}