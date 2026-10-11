export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format as short weekday, short month, numeric day, and year
  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  
  return formatted.replace(/,/g, "");
};
