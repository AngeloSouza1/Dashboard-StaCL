'use client'

import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Stack,
  Divider,
  Grid,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import {
  CreditCard,
  TrendingUp,
  SwapHoriz,
  LocalShipping,
  PieChart,
  ShowChart,
  CompareArrows,
  ArrowBack,
  Info,
} from '@mui/icons-material'

const IconCircle = ({ icon, bgColor }: { icon: React.ReactNode; bgColor: string }) => (
  <Box
    sx={{
      bgcolor: bgColor,
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {icon}
  </Box>
)

const CardInfo = ({
  title,
  description,
  example,
  icon,
  color,
}: {
  title: string
  description: string
  example?: string
  icon: React.ReactNode
  color: string // agora espera uma string (hex ou theme.palette.color.main)
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 3,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <IconCircle icon={icon} bgColor={color} />
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
      {description}
    </Typography>
    {example && (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ fontStyle: 'italic' }}>
        <Info fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          {example}
        </Typography>
      </Stack>
    )}
  </Paper>
)

export default function KpiExplicacaoPage() {
  const router = useRouter()
  const theme = useTheme() // só aqui é permitido!

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          📊 Explicação de Indicadores
        </Typography>
        <Button
          onClick={() => router.push('/')}
          startIcon={<ArrowBack />}
          variant="contained"
          color="primary"
        >
          Voltar
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CardInfo
            title="Ticket Médio (filtrado)"
            description="Valor médio por pedido considerando apenas vendas (sem trocas)."
            example="Ex: 10 pedidos = R$ 5.000 → Ticket Médio: R$ 500,00"
            icon={<CreditCard sx={{ color: 'white' }} />}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Crescimento Mensal"
            description="Percentual de variação entre o valor vendido no mês atual e no anterior."
            example="Abril: R$ 10.000 | Maio: R$ 12.000 → Crescimento: 20%"
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="% Trocas sobre Vendas"
            description="Percentual do valor das trocas em relação às vendas no mesmo período."
            example="R$ 10.000 vendidos, R$ 500 trocados → 5%"
            icon={<SwapHoriz sx={{ color: 'white' }} />}
            color={theme.palette.error.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Trocas Totais (Produto)"
            description="Somatório das trocas detectadas via nome do produto contendo a palavra 'troca'."
            example="Produto 'TROCA CAIXA' → R$ 400"
            icon={<SwapHoriz sx={{ color: 'white' }} />}
            color={theme.palette.secondary.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Trocas no Mês"
            description="Valor total de trocas registradas no mês mais recente."
            example="Maio teve R$ 739,62 em trocas"
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color={theme.palette.secondary.light}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Maior Rota de Troca"
            description="Rota com maior valor acumulado de trocas no filtro atual."
            example="Rota 'Centro' teve R$ 1.200 em trocas"
            icon={<LocalShipping sx={{ color: 'white' }} />}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Vendas por Mês"
            description="Evolução mensal do valor total de vendas ao longo do tempo."
            example="Gráfico de linha com tendência de vendas por mês"
            icon={<ShowChart sx={{ color: 'white' }} />}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Trocas por Mês"
            description="Acompanhamento mensal dos valores trocados."
            example="Visualiza crescimento ou queda nas trocas"
            icon={<SwapHoriz sx={{ color: 'white' }} />}
            color={theme.palette.error.light}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Trocas por Rota"
            description="Mostra as rotas com maior volume financeiro de trocas."
            example="Ex: Rota Oeste R$ 500, Rota Norte R$ 1.000"
            icon={<LocalShipping sx={{ color: 'white' }} />}
            color={theme.palette.warning.dark}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Total de Vendas e Trocas"
            description="Compara o total vendido com o total trocado no período filtrado e geral."
            example="Ex: Filtrado → R$ 100.000 em vendas / R$ 1.200 em trocas"
            icon={<PieChart sx={{ color: 'white' }} />}
            color={theme.palette.primary.dark}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Faturamento Anual (Pizza)"
            description="Distribuição percentual do faturamento por ano em formato de gráfico de pizza."
            example="Ex: 2023 = 55%, 2024 = 45%"
            icon={<PieChart sx={{ color: 'white' }} />}
            color={theme.palette.secondary.dark}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CardInfo
            title="Comparativo Ano a Ano"
            description="Mostra as vendas mensais lado a lado entre diferentes anos."
            example="Ex: Maio 2023 vs Maio 2024"
            icon={<CompareArrows sx={{ color: 'white' }} />}
            color={theme.palette.primary.light}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
