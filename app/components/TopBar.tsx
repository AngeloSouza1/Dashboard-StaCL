"use client"
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material"
import { Menu as MenuIcon, CalendarToday, AccessTime } from "@mui/icons-material"
import { useEffect, useState } from "react"

interface TopBarProps {
  onMenuClick: () => void
  drawerWidth: number
}

export default function TopBar({ onMenuClick, drawerWidth }: TopBarProps) {
  const [dateTime, setDateTime] = useState({ date: "", time: "" })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setDateTime({
        date: now.toLocaleDateString("pt-BR", { dateStyle: "short" }),
        time: now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AppBar
    position="fixed"
    sx={{
      width: "100%", // antes: calc(100% - drawerWidth)
      ml: 0,
      backgroundColor: "white",
      color: "text.primary",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 64,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Título e ícone de menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: "1.4rem",
              whiteSpace: "nowrap",
            }}
          >
            Dashboard de Vendas
          </Typography>
        </Box>

        {/* Data e hora */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
              {dateTime.date}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTime fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
              {dateTime.time}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
