"use client";

import { InputForm } from "@/app/_components/barcode/input-form";
import { Instructions } from "@/app/_components/barcode/instructions";
import { Results } from "@/app/_components/barcode/results";
import { Separator } from "@/app/_components/ui/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/ui/tabs";
import { barcodeEncoder } from "@/src/utils/barcode-encoder";
import { useState } from "react";

interface BarcodeResult {
	original: string;
	encoded: string;
	id: string; // Unique identifier for the result
}

export default function GeneratorPage() {
	const [results, setResults] = useState<BarcodeResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("generate");

	const handleGenerateBarcodes = async (values: string[]) => {
		setIsLoading(true);

		try {
			// Simulate a delay for UX purposes (remove in production if not needed)
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Generate barcode for each input string
			const encodedValues = barcodeEncoder.encodeBulk(values);

			// Create results array with unique IDs
			const newResults = values.map((original, index) => ({
				original,
				encoded: encodedValues[index] || "Error encoding",
				id: `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`, // Generate unique ID
			}));

			setResults(newResults);

			// Switch to results tab if there are results
			if (newResults.length > 0) {
				setActiveTab("results");
			}
		} catch (error) {
			console.error("Error generating barcodes:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto mt-16 max-w-5xl px-4 py-8">
			<div className="space-y-4">
				<div className="space-y-2">
					<h1 className="font-bold text-3xl tracking-tight">
						Code 128 Barcode Generator
					</h1>
					<p className="text-muted-foreground">
						Generate Code 128 barcodes in bulk for use with spreadsheets and
						barcode fonts
					</p>
				</div>

				<Separator className="my-6" />

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="generate">Generate</TabsTrigger>
						<TabsTrigger value="results" disabled={results.length === 0}>
							Results {results.length > 0 && `(${results.length})`}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="generate" className="mt-6 space-y-6">
						<InputForm
							onSubmit={handleGenerateBarcodes}
							isLoading={isLoading}
						/>
						<Instructions />
					</TabsContent>

					<TabsContent value="results" className="mt-6 space-y-6">
						<Results results={results} />
						<Instructions />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
