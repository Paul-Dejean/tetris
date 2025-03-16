export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="px-8 py-2 text-xl font-bold rounded cursor-pointer bg-background text-primary border-1 border-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
