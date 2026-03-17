export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-primary-400 animate-spin rounded-full border-5 border-b-gray-300"
    />
  );
}
