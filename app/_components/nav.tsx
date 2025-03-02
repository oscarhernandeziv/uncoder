"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { cn } from "./utils";

export default function Nav({ className }: { className?: string }) {
	return (
		<nav
			className={cn(
				"flex w-full items-center justify-between border-b px-6 py-4",
				className,
			)}
		>
			<div className="flex items-center gap-6">
				<Link href="/" className="font-bold text-lg">
					Uncoder
				</Link>
				<Link
					href="/generator"
					className="text-muted-foreground text-sm transition-colors hover:text-foreground"
				>
					Generator
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm">
					Sign In
				</Button>
				<Button size="sm">Sign Up</Button>
				<ThemeToggle />
			</div>
		</nav>
	);
}
