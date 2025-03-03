"use client";

import { Button } from "@/app/_components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";
import { Label } from "@/app/_components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type React from "react";

interface InputFormProps {
	onSubmit: (values: string[]) => void;
	isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
	const [inputText, setInputText] = useState<string>("");
	const [codeSetPreference, setCodeSetPreference] = useState<string>("auto");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputText.trim()) {
			return;
		}

		// Split the input by newlines and filter out empty lines
		const values = inputText
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		onSubmit(values);
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Input Data</CardTitle>
				<CardDescription>
					Enter one string per line. Each line will be converted to a Code 128
					barcode.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="input-text">Barcode Data</Label>
						<Textarea
							id="input-text"
							placeholder="Enter one item per line, e.g.:&#10;PRODUCT-12345&#10;ITEM-67890&#10;BATCH-54321"
							className="min-h-[200px] font-mono"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="code-set">Code Set Preference</Label>
						<Select
							value={codeSetPreference}
							onValueChange={setCodeSetPreference}
						>
							<SelectTrigger id="code-set" className="w-full">
								<SelectValue placeholder="Select Code Set" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="auto">Auto (Recommended)</SelectItem>
								<SelectItem value="a">Code Set A</SelectItem>
								<SelectItem value="b">Code Set B</SelectItem>
								<SelectItem value="c">Code Set C (Numbers Only)</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground text-sm">
							Auto will choose the optimal code set based on your data.
						</p>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={!inputText.trim() || isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating Barcodes...
							</>
						) : (
							"Generate Barcodes"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
