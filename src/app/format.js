export const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const ye = new Intl.DateTimeFormat(['fr', 'en'], { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat(['fr', 'en'], { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat(['fr', 'en'], { day: '2-digit' }).format(date)
    const month = mo.charAt(0).toUpperCase() + mo.slice(1)

    return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
  } catch (err) {
    console.error(err);
  }

  const defaultDate = new Date();

  const ye = new Intl.DateTimeFormat(['fr', 'en'], { year: 'numeric' }).format(defaultDate)
  const mo = new Intl.DateTimeFormat(['fr', 'en'], { month: 'short' }).format(defaultDate)
  const da = new Intl.DateTimeFormat(['fr', 'en'], { day: '2-digit' }).format(defaultDate)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)

  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refusé"
    default:
      throw new Error("status not supported");
  }
}