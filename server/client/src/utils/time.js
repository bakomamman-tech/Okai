const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const ranges = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2628000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

export const formatRelativeTime = (dateValue) => {
  if (!dateValue) {
    return "just now";
  }

  const secondsElapsed = Math.round((new Date(dateValue).getTime() - Date.now()) / 1000);

  for (const range of ranges) {
    if (Math.abs(secondsElapsed) >= range.seconds) {
      return relativeTimeFormatter.format(
        Math.round(secondsElapsed / range.seconds),
        range.unit
      );
    }
  }

  return "just now";
};
