import { UserButton } from "@clerk/clerk-react";
import { Link } from "wouter";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface HeaderProps {
  breadcrumb?: ReactNode;
}

export function Header({ breadcrumb }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 border-b bg-card/80 backdrop-blur-md text-card-foreground">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="text-xl font-display tracking-tight text-foreground hover:opacity-80 transition-opacity">
          2M Arquitectos <span className="text-muted-foreground font-light">&middot; Panel</span>
        </Link>
        {breadcrumb && (
          <div className="flex items-center text-sm text-muted-foreground">
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            {breadcrumb}
          </div>
        )}
      </div>
      <UserButton appearance={{ elements: { userButtonPopoverCard: 'rounded-none', avatarBox: 'w-8 h-8 rounded-none' } }} />
    </header>
  );
}
