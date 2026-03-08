import { resolveAssetUrl } from "../api";

const buildInitials = (label = "Okai") =>
  label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

export default function Avatar({ user, size = "md", className = "" }) {
  const label = user?.name || user?.username || "Okai";
  const classes = `avatar avatar-${size} ${className}`.trim();

  if (user?.avatar) {
    return <img className={classes} src={resolveAssetUrl(user.avatar)} alt={label} />;
  }

  return <div className={classes}>{buildInitials(label)}</div>;
}
