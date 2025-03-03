"use client";

import { Button } from "@/app/_components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/app/_components/ui/table";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BarcodeResult {
	original: string;
	encoded: string;
	id?: string; // Unique identifier for the result
}

interface ResultsProps {
	results: BarcodeResult[];
}

export function Results({ results }: ResultsProps) {
	const [copiedIndexes, setCopiedIndexes] = useState<Set<number>>(new Set());

	// Copy a single encoded result to clipboard
	const copyToClipboard = async (text: string, index: number) => {
		try {
			await navigator.clipboard.writeText(text);

			// Update UI to show copied state
			setCopiedIndexes((prev) => {
				const newSet = new Set(prev);
				newSet.add(index);
				return newSet;
			});

			// Reset after 2 seconds
			setTimeout(() => {
				setCopiedIndexes((prev) => {
					const newSet = new Set(prev);
					newSet.delete(index);
					return newSet;
				});
			}, 2000);

			toast.success("Copied!", {
				description: "Barcode copied to clipboard",
			});
		} catch (err) {
			console.error(err);
			toast.error("Error", {
				description: "Failed to copy to clipboard",
			});
		}
	};

	// Copy all encoded results to clipboard
	const copyAllToClipboard = async () => {
		try {
			const allText = results.map((r) => r.encoded).join("\n");
			await navigator.clipboard.writeText(allText);

			toast.success("All Copied!", {
				description: "All barcodes copied to clipboard",
			});
		} catch (err) {
			console.error(err);
			toast.error("Error", {
				description: "Failed to copy to clipboard",
			});
		}
	};

	if (results.length === 0) {
		return null;
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Generated Barcodes</CardTitle>
						<CardDescription>
							{results.length} barcode{results.length !== 1 ? "s" : ""}{" "}
							generated
						</CardDescription>
					</div>

					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={copyAllToClipboard}
					>
						<Copy className="h-4 w-4" />
						Copy All
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">#</TableHead>
								<TableHead>Original Data</TableHead>
								<TableHead>Encoded Barcode</TableHead>
								<TableHead className="w-[100px]">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{results.map((result, index) => (
								<TableRow key={result.id || `barcode-result-${index}`}>
									<TableCell>{index + 1}</TableCell>
									<TableCell className="font-mono">{result.original}</TableCell>
									<TableCell className="max-w-[300px] truncate font-mono">
										{result.encoded}
									</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => copyToClipboard(result.encoded, index)}
										>
											{copiedIndexes.has(index) ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="mt-4 text-muted-foreground text-sm">
					<p>
						Tip: Paste these encoded strings into a spreadsheet cell that uses a
						Code 128 barcode font.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
