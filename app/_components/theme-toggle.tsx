"use client";

import { Label } from "@/app/_components/ui/label";
import { Switch } from "@/app/_components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

export default function ThemeToggle() {
	const id = useId();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch by mounting after the client-side render
	useEffect(() => {
		setMounted(true);
	}, []);

	// Handle theme toggle
	const handleToggle = (checked: boolean) => {
		setTheme(checked ? "light" : "dark");
	};

	// Determine if dark theme is active, default to false until mounted
	const isDarkTheme = mounted ? theme === "dark" : false;

	return (
		<div className="inline-flex items-center gap-2">
			<Switch
				id={id}
				checked={mounted && !isDarkTheme}
				onCheckedChange={handleToggle}
				aria-label="Toggle theme"
				disabled={!mounted}
			/>
			<Label htmlFor={id}>
				<span className="sr-only">Toggle theme</span>
				{mounted &&
					(!isDarkTheme ? (
						<SunIcon size={16} aria-hidden="true" />
					) : (
						<MoonIcon size={16} aria-hidden="true" />
					))}
			</Label>
		</div>
	);
}
