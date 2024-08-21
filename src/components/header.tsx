import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-red-500 flex items-center justify-between bg-transparent px-4 py-1  backdrop-blur md:px-10">
      <div className="flex items-center gap-1">
        <img
          src="/logo.png"
          alt="Submeter Calculator Logo"
          className="w-12 h-12"
        />
        <h1 className="sc-gradient-text font-semibold text-xl">
          Submeter Calculator
        </h1>
      </div>
      <ModeToggle />
    </header>
  );
}
