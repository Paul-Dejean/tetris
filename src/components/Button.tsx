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
      className="bg-background text-primary font-bold py-2 px-8 rounded border-1 text-xl border-primary cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
