'use client'

import { Box, Card, Typography, Grid } from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

interface KpiCardsProps {
  totalVendas: number
  totalTrocas: number
  totalPedidos: number
  vendasMesAtual: number
  vendasMesAnterior: number
  totalTrocasProduto: number
  trocasMes: number
  trocasPorRota: Record<string, number>
}

export default function KpiCards({
  totalVendas,
  totalTrocas,
  totalPedidos,
  vendasMesAtual,
  vendasMesAnterior,
  totalTrocasProduto,
  trocasMes,
  trocasPorRota,
}: KpiCardsProps) {
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0
  const crescimentoPercent = vendasMesAnterior > 0
    ? ((vendasMesAtual - vendasMesAnterior) / vendasMesAnterior) * 100
    : 0
  const trocasPercent = vendasMesAtual > 0
  ? (trocasMes / vendasMesAtual) * 100
  : 0

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const maiorRotaTroca = Object.entries(trocasPorRota).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  const kpis = [
    {
      title: 'Ticket Médio (filtrado)',
      value: formatCurrency(ticketMedio),
      icon: <CreditCardIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
      color: 'primary.main',
      caption: `Base: ${totalPedidos} pedidos`,
    },
    {
      title: 'Crescimento Mensal',
      value: formatPercent(crescimentoPercent),
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#388e3c' }} />,
      color: 'success.main',
      caption: `Mês atual: ${formatCurrency(vendasMesAtual)}`,
    },
    {
      title: '% Trocas sobre Vendas',
      value: formatPercent(trocasPercent),
      icon: <SwapHorizIcon sx={{ fontSize: 32, color: '#d32f2f' }} />,
      color: 'error.main',
      caption: `Total trocado: ${formatCurrency(trocasMes)}`,
    },
    {
      title: 'Trocas Totais (Produto)',
      value: formatCurrency(totalTrocasProduto),
      icon: <SwapHorizIcon sx={{ fontSize: 32, color: '#6a1b9a' }} />,
      color: 'secondary.main',
      caption: 'Detectado pelo nome do produto',
    },
    {
      title: 'Trocas no Mês',
      value: formatCurrency(trocasMes),
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#8e24aa' }} />,
      color: 'secondary.light',
      caption: 'Último mês registrado',
    },
    {
      title: 'Maior Rota de Troca',
      value: maiorRotaTroca,
      icon: <LocalShippingIcon sx={{ fontSize: 32, color: '#ab47bc' }} />,
      color: 'warning.main',
      caption: 'Com maior valor de troca',
    },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {kpis.map(({ title, value, icon, color, caption }) => (
        <Grid item xs={12} sm={4} key={title}>
          <Card sx={{ p: 3, textAlign: 'center', borderTop: `6px solid`, borderColor: color }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
              {icon}
              <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
                {title}
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', display: 'block' }}>
              {caption}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
