export function safeLower(value: any): string {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
  
    if (typeof value === 'number') {
      return String(value).toLowerCase()
    }
  
    return ''
  }
  