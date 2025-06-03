import { parse } from "date-fns"

export interface SheetData {
  id: string
  data: string // armazena como ISO
  chavePedido: string
  codigoCliente: string
  codigoProduto: string
  cliente: string
  produto: string
  quantidade: number
  embalagem: string
  valorUnitario: number
  valorTotal: number
  rota: string
  ccomss: string
  st: string
  vendaEfetivada: string
  troca: string
  valorTroca: number
}

export class GoogleSheetsService {
  private static readonly SHEET_ID = "1VA5okyqOhRZwcGeRfUwanNgsfXpPocKMxZX0N3qhNS0"
  private static readonly API_KEY = "AIzaSyB0uc2G4uB3fe2SiXcUSDbPTwAqBXz7NZU"
  private static readonly RANGE = "BD!A1:Q"

  static async fetchData(): Promise<SheetData[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.RANGE}?key=${this.API_KEY}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${data.error?.message || "Unknown error"}`)
      }

      const rows = data.values || []
      const entries = rows.slice(1)

    
      return entries.map((row: string[], index: number): SheetData => {
        // Corrigindo a data
        const rawDate = row[1] || ""
        const parsed = parse(rawDate, "dd/MM/yyyy", new Date())
        const isoDate = isNaN(parsed.getTime()) ? "" : parsed.toISOString()

        return {
          id: row[0] || `row-${index}`,
          data: isoDate,
          chavePedido: row[2] || "",
          codigoCliente: row[3] || "",
          codigoProduto: row[4] || "",
          cliente: row[5] || "",
          produto: row[6] || "",
          quantidade: parseFloat(row[7]) || 0,
          embalagem: row[8] || "",
          valorUnitario: parseFloat(row[9]) || 0,
          valorTotal: parseFloat((row[10] || "0").replace(/\./g, "").replace(",", ".")) || 0,
          rota: row[11] || "",
          ccomss: row[12] || "",
          st: row[13] || "",
          vendaEfetivada: row[14] || "",
          troca: row[15] || "",
          valorTroca: parseFloat((row[16] || "0").replace(/\./g, "").replace(",", ".")) || 0,
        }
      })
    } catch (error) {
      console.error("Erro ao buscar dados do Google Sheets:", error)
      throw error
    }
  }

  static async updateData(id: string, data: Partial<SheetData>): Promise<void> {
    console.log("Update mock:", id, data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  static async addData(data: Omit<SheetData, "id">): Promise<SheetData> {
    const newData: SheetData = {
      ...data,
      id: `${Date.now()}`,
    }
    console.log("Add mock:", newData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return newData
  }

  static async deleteData(id: string): Promise<void> {
    console.log("Delete mock:", id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
