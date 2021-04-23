const intl = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
})

export function formatPrice(val: string): string {
  if (!val) {
    return "$-"
  }

  // replace the decimal delimiter
  const num = Number(val.replace(",", "."))

  return intl.format(num)
}
