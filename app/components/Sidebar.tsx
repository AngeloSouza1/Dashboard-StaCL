"use client"

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material"
import {
  Business as BusinessIcon,
  PointOfSale as PointOfSaleIcon,
  MonetizationOn as MonetizationOnIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import DescriptionIcon from '@mui/icons-material/Description'
import { usePathname } from "next/navigation"
import Link from "next/link"

interface SidebarProps {
  open: boolean
  onClose: () => void
  drawerWidth: number
  isMobile: boolean
}

const menuItems = [
  { text: "Vendas", icon: <PointOfSaleIcon />, path: "/" },
  { text: "Cards Explicados", icon: <InfoIcon />, path: "/kpi-explicacao" },
  { text: "Relatório", icon: <DescriptionIcon />, path: "/relatorio" },
]

export default function Sidebar({ open, onClose, drawerWidth, isMobile }: SidebarProps) {
  const theme = useTheme()
  const pathname = usePathname()

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      {open && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <BusinessIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.4rem" }}>
            Análise Sta Clara
          </Typography>
        </Box>
      )}

      <Divider />

      <List sx={{ flexGrow: 1, px: open ? 2 : 1, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <Link href={item.path} style={{ width: "100%", textDecoration: "none" }}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? "primary.main" : "transparent",
                      color: isActive ? "white" : "text.primary",
                      "&:hover": {
                        backgroundColor: isActive ? "primary.dark" : "action.hover",
                      },
                      justifyContent: open ? "flex-start" : "center",
                      px: open ? 2 : 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "white" : "text.secondary",
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.95rem",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Link>
              </Tooltip>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{
        width: { md: open ? drawerWidth : 72 },
        flexShrink: { md: 0 },
        transition: "width 0.3s",
      }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}
