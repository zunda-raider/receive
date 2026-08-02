interface GeneratedAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const gradients = [
  ["#B8143F", "#FF6F5E"],
  ["#FF6F5E", "#FFB27A"],
  ["#B8143F", "#FFB27A"],
  ["#C9A45C", "#FFB27A"],
  ["#D41F4D", "#FF6F5E"],
  ["#FF6F5E", "#FCE9E6"],
  ["#B8143F", "#C9A45C"],
  ["#FFB27A", "#FF6F5E"],
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function GeneratedAvatar({ name, size = 64, className = "" }: GeneratedAvatarProps) {
  const idx = hashName(name) % gradients.length;
  const [from, to] = gradients[idx];
  const initials = name.slice(0, 1);

  return (
    <div
      className={`flex items-center justify-center font-display font-medium text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        borderRadius: Math.max(12, size * 0.28),
        background: `linear-gradient(135deg, ${from}, ${to})`,
        boxShadow: "0 6px 24px rgba(184,20,63,0.10)",
      }}
    >
      {initials}
    </div>
  );
}
