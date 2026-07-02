// Tarihi temiz Türkçe formata çevirir: "3 Haziran 2026"
export function formatDate(input?: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
