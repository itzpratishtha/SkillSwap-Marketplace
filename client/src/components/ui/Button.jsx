import clsx from "clsx";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white",

    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "w-full rounded-xl px-4 py-3 font-medium transition duration-200",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}