"use client"

import React from "react"
import { Autocomplete } from "@mui/material"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Typography,
  IconButton,
  Skeleton,
  InputAdornment,
  Grid,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { SheetData } from "../services/googleSheetsService"
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"



import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Map as MapIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  FormatListNumbered as FormatListNumberedIcon, 
  FilterAltOff as FilterAltOffIcon,
  MonetizationOn as MonetizationOnIcon          
} from "@mui/icons-material"


interface DataTableProps {
  data: SheetData[]
  loading: boolean
  filters: {
    id: string
    search: string
    rota: string
    produto: string
    dateRange: { start: Date | null; end: Date | null }
    minQtd: number | null
    minValor: number | null
  }
  
  
  onFilterChange: (filters: any) => void
  onRefresh: () => void
}

export default function DataTable({ data, loading, filters, onFilterChange, onRefresh }: DataTableProps) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleClearFilters = () => {
    onFilterChange({
      id: "",
      search: "",
      rota: "",
      produto: "",
      dateRange: { start: null, end: null },
      minQtd: null,
      minValor: null,
    })
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Pedidos
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={onRefresh} color="primary" title="Atualizar">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={handleClearFilters} color="secondary" title="Limpar Filtros">
            <FilterAltOffIcon />
          </IconButton>
        </Box>
      </Box>


      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
  
  
        {/* Campo de busca */}
        <Grid item xs={12} sm={6} md={3}>
        <Autocomplete
          freeSolo
          disableClearable
          options={[...new Set(data.map((row) => row.cliente).filter(Boolean))]}
          value={filters.search}
          inputValue={filters.search}
          onInputChange={(event, newValue) => {
            onFilterChange({ ...filters, search: newValue })
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente"
              placeholder="Buscar ou selecionar cliente"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                type: 'search',
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>






 {/* Filtro por rota */}
 <Grid item xs={12} sm={6} md={3}>
    <Autocomplete
      freeSolo
      disableClearable
      options={[...new Set(data.map((row) => row.rota).filter(Boolean))]}
      value={filters.rota}
      inputValue={filters.rota}
      onInputChange={(event, newValue) =>
        onFilterChange({ ...filters, rota: newValue })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rota"
          placeholder="Buscar ou selecionar rota"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <MapIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  </Grid>

 {/* Filtro por produto */}
 <Grid item xs={12} sm={6} md={3}>
    <Autocomplete
      freeSolo
      disableClearable
      options={[...new Set(data.map((row) => row.produto).filter(Boolean))]}
      value={filters.produto}
      inputValue={filters.produto}
      onInputChange={(event, newValue) =>
        onFilterChange({ ...filters, produto: newValue })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Produto"
          placeholder="Buscar ou selecionar produto"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <InventoryIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  </Grid>

  {/* Data inicial */}
<Grid item xs={12} sm={6} md={3}>
<DatePicker
  label="Data inicial"
  inputFormat="dd-MM-yyyy"
  value={filters.dateRange.start}
  maxDate={filters.dateRange.end || undefined} // ⬅️ Garante que a inicial não ultrapasse a final
  onChange={(newDate) =>
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, start: newDate },
    })
  }
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <CalendarTodayIcon />
          </InputAdornment>
        ),
      }}
    />
  )}
/>

</Grid>

{/* Filtro por ID */}
<Grid item xs={12} sm={6} md={3}>
  <TextField
    fullWidth
    label="Filtrar por ID"
    placeholder="Ex: 1001"
    value={filters.id}
    onChange={(e) => onFilterChange({ ...filters, id: e.target.value })}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <AssignmentIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>


{/* Filtro por quantidade mínima */}
<Grid item xs={12} sm={6} md={3}>
  <TextField
    fullWidth
    type="number"
    label="Qtd. mínima"
    placeholder="Ex: 5"
    value={filters.minQtd ?? ""}
    onChange={(e) => onFilterChange({ ...filters, minQtd: e.target.value ? parseInt(e.target.value, 10) : null })}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FormatListNumberedIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>

{/* Filtro por valor total mínimo */}
<Grid item xs={12} sm={6} md={3}>
  <TextField
    fullWidth
    type="number"
    label="Valor mínimo (R$)"
    placeholder="Ex: 100"
    value={filters.minValor ?? ""}
    onChange={(e) => onFilterChange({ ...filters, minValor: e.target.value ? parseFloat(e.target.value) : null })}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <MonetizationOnIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>
{/* Data final */}
<Grid item xs={12} sm={6} md={3}>
  <DatePicker
  label="Data final"
  inputFormat="dd-MM-yyyy"
  value={filters.dateRange.end}
  minDate={filters.dateRange.start || undefined} // ⬅️ Garante que a final não seja menor que a inicial
  onChange={(newDate) =>
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, end: newDate },
    })
  }
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <EventIcon />
          </InputAdornment>
        ),
      }}
    />
  )}
/>
</Grid>

</Grid>


  {/* Tabela */}
  <TableContainer sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "primary.main" }}>
        {[
          { label: "ID", icon: <AssignmentIcon fontSize="small" /> },
          { label: "Data", icon: <CalendarTodayIcon fontSize="small" /> },
          { label: "Cliente", icon: <PersonIcon fontSize="small" /> },
          { label: "Produto", icon: <InventoryIcon fontSize="small" /> },
          { label: "Quantidade", icon: <FormatListNumberedIcon fontSize="small" /> },
          { label: "Valor Total", icon: <MonetizationOnIcon fontSize="small" /> },
        ].map(({ label, icon }) => (
          <TableCell
            key={label}
            sx={{
              fontWeight: 600,
              color: "white",
              fontSize: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {icon}
              {label}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
    {data
.filter((row) => {
  const matchId =
    !filters.id || row.id?.toString().toLowerCase().includes(filters.id.toLowerCase())

  const matchSearch =
  !filters.search || row.cliente?.toLowerCase().includes(filters.search.toLowerCase())
   

  const matchRota =
    !filters.rota || row.rota?.toLowerCase().includes(filters.rota.toLowerCase())

  const matchProduto =
    !filters.produto || row.produto?.toLowerCase().includes(filters.produto.toLowerCase())

  const rowDate = new Date(row.data)
  const matchDateStart = !filters.dateRange.start || rowDate >= filters.dateRange.start
  const matchDateEnd = !filters.dateRange.end || rowDate <= filters.dateRange.end

  const quantidade = Number(row.quantidade)
  const valorTotal = Number(row.valorTotal)

  const matchQtd =
    filters.minQtd == null || isNaN(quantidade)
      ? true
      : quantidade >= filters.minQtd

  const matchValor =
    filters.minValor == null || isNaN(valorTotal)
      ? true
      : valorTotal >= filters.minValor

  return (
    matchId &&
    matchSearch &&
    matchRota &&
    matchProduto &&
    matchDateStart &&
    matchDateEnd &&
    matchQtd &&
    matchValor
  )
})

  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((row, index) => (

          <TableRow
            key={row.id}
            hover
            sx={{
              
              backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
              "&:last-child td": { borderBottom: 0 },
              "& td": {
                fontSize: "1.0rem",
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          >
            <TableCell>{row.id}</TableCell>
            <TableCell>{formatDate(row.data)}</TableCell>
            <TableCell>{row.cliente}</TableCell>
            <TableCell>{row.produto}</TableCell>
            <TableCell>{row.quantidade}</TableCell>
            <TableCell>{formatCurrency(row.valorTotal)}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
</TableContainer>


      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:" 
      />
    </Paper>
  </LocalizationProvider>  
  )
}
