export function timestampFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(new Date(ISODateString))
    .replace(",", "")
    .replaceAll(".", ":");
}

export function chatTimeFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(ISODateString))
    .replace(",", "")
    .replaceAll(".", ":");
}
