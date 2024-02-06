export function dateFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(ISODateString));
}

export function dateChatFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(ISODateString));
}
