"use client"

import React from "react"
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from "chart.js"
import { Bar, Line, Pie } from "react-chartjs-2"
import KpiCards from './KpiCards'
import type { SheetData } from "../services/googleSheetsService"
import { format } from "date-fns"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

import {
  BarChart as BarChartIcon,
  MonetizationOn as MonetizationOnIcon,
  LocalShipping as LocalShippingIcon,
  ShowChart as ShowChartIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  CompareArrows as CompareArrowsIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material"

const CardHeader = ({
  title,
  icon: Icon,
  color,
}: {
  title: string
  icon: React.ElementType
  color: string
}) => (
  <Box sx={{ bgcolor: color, py: 2, px: 3, textAlign: "center" }}>
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
      <Icon sx={{ color: "white" }} />
      <Typography variant="h6" fontWeight={600} sx={{ color: "white" }}>
        {title}
      </Typography>
    </Box>
  </Box>
)

interface ChartsSectionProps {
  data: SheetData[]
  loading: boolean
  fullData?: SheetData[]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

const sumBy = (arr: SheetData[], key: keyof SheetData) =>
  arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)

const topN = (map: Record<string, number>, limit = 10) =>
  Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, limit)

const makeBarData = (label: string, entries: [string, number][]) => {
  const colors = [
    "rgba(25, 118, 210, 0.7)", "rgba(46, 125, 50, 0.7)", "rgba(255, 152, 0, 0.7)",
    "rgba(220, 0, 78, 0.7)", "rgba(156, 39, 176, 0.7)", "rgba(0, 172, 193, 0.7)",
    "rgba(121, 85, 72, 0.7)", "rgba(255, 87, 34, 0.7)", "rgba(124, 179, 66, 0.7)",
    "rgba(171, 71, 188, 0.7)"
  ]

  return {
    labels: entries.map(([key]) => key),
    datasets: [
      {
        label,
        data: entries.map(([, val]) => val),
        backgroundColor: entries.map((_, i) => colors[i % colors.length]),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  }
}

export default function ChartsSection({ data, loading, fullData }: ChartsSectionProps) {
  const CHART_HEIGHT = 500
  const INNER_HEIGHT = 400

const totalGeralVendas = sumBy(fullData || [], "valorTotal")
const totalGeralTrocas = sumBy(fullData || [], "valorTroca")


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
  }

  const isTrocaProduto = (produto?: string) => {
    if (!produto) return false
    return produto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes("troca")
  }

  const vendasSemTroca = React.useMemo(() =>
   data.filter(item => !isTrocaProduto(item.produto)),
  [data])

// Trocas com "troca" no nome - filtradas pelo período
const trocasProdutoFiltradas = data.filter(item => isTrocaProduto(item.produto))
const totalFiltradoTrocasProduto = sumBy(trocasProdutoFiltradas, "valorTotal")

// Trocas com "troca" no nome - geral (sem filtro)
const trocasProdutoGeral = (fullData || []).filter(item => isTrocaProduto(item.produto))
const totalGeralTrocasProduto = sumBy(trocasProdutoGeral, "valorTotal")




  const trocasPorProduto = React.useMemo(() =>
    data.filter(item => isTrocaProduto(item.produto)),
  [data])

  const totalFiltradoVendas = sumBy(vendasSemTroca, "valorTotal")
  const totalFiltradoTrocas = sumBy(trocasPorProduto, "valorTroca")
  const trocasPorProdutoGeral = (fullData || []).filter(item =>
    isTrocaProduto(item.produto)
  )
  
  const totalTrocasProduto = sumBy(trocasPorProdutoGeral, "valorTotal")
  

  const totalPedidos = vendasSemTroca.length
  const totalVendas = totalFiltradoVendas
  const totalTrocas = totalFiltradoTrocas
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0


  const produtoQtd = vendasSemTroca.reduce((acc, item) => {
    acc[item.produto] = (acc[item.produto] || 0) + item.quantidade
    return acc
  }, {} as Record<string, number>)

  const produtoValor = vendasSemTroca.reduce((acc, item) => {
    acc[item.produto] = (acc[item.produto] || 0) + item.valorTotal
    return acc
  }, {} as Record<string, number>)

  const rotaValor = vendasSemTroca.reduce((acc, item) => {
    acc[item.rota] = (acc[item.rota] || 0) + item.valorTotal
    return acc
  }, {} as Record<string, number>)

  const trocasPorRota = React.useMemo(() =>
    trocasPorProduto.reduce((acc, item) => {
      const rota = item.rota || "Sem Rota"
      acc[rota] = (acc[rota] || 0) + item.valorTotal
      return acc
    }, {} as Record<string, number>),
  [trocasPorProduto])

  const faturamentoAnual = React.useMemo(() =>
    (fullData || data).reduce((acc, item) => {
      const ano = new Date(item.data).getFullYear().toString()
      acc[ano] = (acc[ano] || 0) + item.valorTotal
      return acc
    }, {} as Record<string, number>),
  [fullData, data])

  const colorPalette = [
    "rgba(25, 118, 210, 0.7)", "rgba(46, 125, 50, 0.7)", "rgba(255, 152, 0, 0.7)",
    "rgba(220, 0, 78, 0.7)", "rgba(156, 39, 176, 0.7)", "rgba(0, 172, 193, 0.7)",
    "rgba(121, 85, 72, 0.7)", "rgba(255, 87, 34, 0.7)", "rgba(124, 179, 66, 0.7)", "rgba(171, 71, 188, 0.7)"
  ]



  const faturamentoAnualChartData = {
    labels: Object.keys(faturamentoAnual),
    datasets: [
      {
        label: "Faturamento por Ano",
        data: Object.values(faturamentoAnual),
        backgroundColor: Object.keys(faturamentoAnual).map((_, i) => colorPalette[i % colorPalette.length]),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  }

  const vendasPorMes = React.useMemo(() =>
    vendasSemTroca.reduce((acc, item) => {
      const mes = format(new Date(item.data), "MMM yyyy")
      acc[mes] = (acc[mes] || 0) + item.valorTotal
      return acc
    }, {} as Record<string, number>),
  [vendasSemTroca])

  const trocasPorMes = React.useMemo(() =>
    trocasPorProduto.reduce((acc, item) => {
      const mes = format(new Date(item.data), "MMM yyyy")
      acc[mes] = (acc[mes] || 0) + item.valorTotal
      return acc
    }, {} as Record<string, number>),
  [trocasPorProduto])

  const sortedMeses = Object.keys(vendasPorMes).sort(
    (a, b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime()
  )

  const sortedMesesTrocas = Object.keys(trocasPorMes).sort(
    (a, b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime()
  )

  const lastIndex = sortedMeses.length - 1
  const vendasMesAtual = lastIndex >= 0 ? vendasPorMes[sortedMeses[lastIndex]] : 0
  const vendasMesAnterior = sortedMeses.at(-2) ? vendasPorMes[sortedMeses.at(-2)!] : 0
  const lastTrocaIndex = sortedMesesTrocas.length - 1
  const trocasMes = lastTrocaIndex >= 0 ? trocasPorMes[sortedMesesTrocas[lastTrocaIndex]] : 0

  const crescimentoPercent = vendasMesAnterior
    ? ((vendasMesAtual - vendasMesAnterior) / vendasMesAnterior) * 100
    : 0


  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 3, height: CHART_HEIGHT, borderRadius: 3 }}>
              <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={INNER_HEIGHT} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
        <KpiCards
            totalVendas={totalVendas}
            totalTrocas={totalTrocas}
            totalPedidos={totalPedidos}
            vendasMesAtual={vendasMesAtual}
            vendasMesAnterior={vendasMesAnterior}
            totalTrocasProduto={totalTrocasProduto}
            trocasMes={trocasMes}
            trocasPorRota={trocasPorRota}
          />
        </Box>
      </Grid>

      {/* Top Produtos e Rotas */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Top 10 Produtos (Qtd)" icon={BarChartIcon} color="primary.main" />
          <Box sx={{ height: INNER_HEIGHT, p: 3 }}>
            <Bar data={makeBarData("Quantidade", topN(produtoQtd))} options={chartOptions} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Top 10 Produtos (Valor R$)" icon={MonetizationOnIcon} color="success.main" />
          <Box sx={{ height: INNER_HEIGHT, p: 3 }}>
            <Bar data={makeBarData("Valor", topN(produtoValor))} options={chartOptions} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Top 10 Rotas (Valor R$)" icon={LocalShippingIcon} color="warning.main" />
          <Box sx={{ height: INNER_HEIGHT, p: 3 }}>
            <Bar data={makeBarData("Rotas", topN(rotaValor))} options={chartOptions} />
          </Box>
        </Paper>
      </Grid>

      {/* Vendas Mensais */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Vendas por Mês (R$)" icon={ShowChartIcon} color="info.main" />
          <Box sx={{ height: INNER_HEIGHT, p: 3 }}>
            <Line
              data={{
                labels: sortedMeses,
                datasets: [
                  {
                    label: "Vendas Mensais",
                    data: sortedMeses.map(mes => vendasPorMes[mes]),
                    borderColor: "rgba(255, 87, 34, 1)",
                    backgroundColor: "rgba(255, 138, 101, 0.2)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Trocas por Mês */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Trocas por Mês" icon={SwapHorizIcon} color="error.main" />
          <Box sx={{ height: INNER_HEIGHT, p: 3 }}>
            <Line
              data={{
                labels: sortedMesesTrocas,
                datasets: [
                  {
                    label: "Trocas (R$)",
                    data: sortedMesesTrocas.map(mes => trocasPorMes[mes]),
                    borderColor: "rgba(233, 30, 99, 1)",
                    backgroundColor: "rgba(233, 30, 99, 0.2)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Trocas por Rota */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <CardHeader title="Trocas por Rota (R$)" icon={LocalShippingIcon} color="warning.main" />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Bar data={makeBarData("Trocas por Rota", topN(trocasPorRota))} options={chartOptions} />
          </Box>
        </Paper>
      </Grid>

   {/* Totais: Vendas e Trocas */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 0,
            height: CHART_HEIGHT,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader title="Total de Vendas e Trocas" icon={PieChartIcon} color="error.main" />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              px: 2,
              textAlign: "center"
            }}
          >
            {/* Vendas Filtradas */}
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Faturamento de Vendas (filtrado)
              </Typography>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.8rem' }}>
                {formatCurrency(totalFiltradoVendas)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                Total Geral: {formatCurrency(totalGeralVendas)}
              </Typography>
            </Box>

            {/* Trocas Totais por Produto */}
            <Box>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Faturamento de Trocas (filtrado)
            </Typography>
            <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700, fontSize: '1.8rem' }}>
              {formatCurrency(totalFiltradoTrocasProduto)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              Total Geral: {formatCurrency(totalGeralTrocasProduto)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Detectado pelo nome do produto
            </Typography>

            </Box>

          </Box>
        </Paper>
      </Grid>



      {/* Faturamento Anual (Pizza) */}
      <Grid item xs={12} md={4}>
      <Paper sx={{ p: 0, height: CHART_HEIGHT, borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <CardHeader title="Faturamento Anual (Pizza)" icon={PieChartIcon} color="primary.dark" />
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pie
            data={faturamentoAnualChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { position: "bottom" },
              },
            }}
          />
        </Box>
      </Paper>

      </Grid>

      {/* Comparativo Ano a Ano */}
      <Grid item xs={12}>
        <Paper sx={{ p: 0, height: 450, borderRadius: 3, overflow: "hidden" }}>
          <CardHeader title="Comparativo de Vendas por Mês (Ano a Ano)" icon={CompareArrowsIcon} color="primary.light" />
          <Box sx={{ height: 360, p: 3 }}>
            <Bar
              data={(() => {
                const grouped: Record<string, Record<string, number>> = {}
                vendasSemTroca.forEach((item) => {
                  const date = new Date(item.data)
                  const year = date.getFullYear().toString()
                  const month = format(date, "MMM")
                  if (!grouped[month]) grouped[month] = {}
                  grouped[month][year] = (grouped[month][year] || 0) + item.valorTotal
                })

                const allYears = Array.from(
                  new Set(data.map((item) => new Date(item.data).getFullYear().toString()))
                ).sort()

                const allMonths = [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ]

                return {
                  labels: allMonths,
                  datasets: allYears.map((year, index) => ({
                    label: year,
                    data: allMonths.map((month) => grouped[month]?.[year] || 0),
                    backgroundColor: colorPalette[index % colorPalette.length],
                    borderRadius: 4,
                  })),
                }
              })()}
              options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
