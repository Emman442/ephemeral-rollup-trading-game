import Link from "next/link";

const footerLinks = ["About", "Rules", "Leaderboard", "Discord"];

export function Footer() {
  return (
    <footer className="w-full h-[80px] border-t border-border">
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <nav className="flex gap-x-8">
          {footerLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
