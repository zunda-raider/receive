interface GeneratedAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const gradients = [
  ["#FF7A59", "#FF4B6E"],
  ["#4ECDC4", "#44A08D"],
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
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
      className={`flex items-center justify-center rounded-full font-bold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials}
    </div>
  );
}
