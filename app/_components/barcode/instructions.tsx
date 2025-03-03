"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/app/_components/ui/accordion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";
import { ExternalLink } from "lucide-react";

export function Instructions() {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>How to Use</CardTitle>
				<CardDescription>
					Learn how to use the Code 128 barcode generator and apply the results
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>What is Code 128?</AccordionTrigger>
						<AccordionContent>
							<p className="mb-2">
								Code 128 is a high-density linear barcode symbology that can
								encode all 128 ASCII characters and is used in a wide variety of
								applications including logistics, retail, and inventory
								management.
							</p>
							<p>
								It has three code sets (A, B, and C) that can be used to
								optimize the barcode size based on the type of data being
								encoded.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-2">
						<AccordionTrigger>Using with Google Sheets</AccordionTrigger>
						<AccordionContent>
							<ol className="list-decimal space-y-2 pl-5">
								<li>
									Install a Code 128 barcode font (see font resources below)
								</li>
								<li>Enter your data in column A</li>
								<li>Use this tool to generate barcode strings</li>
								<li>Copy the encoded strings to column B</li>
								<li>
									Select column B and change the font to your Code 128 font
								</li>
								<li>Adjust font size as needed (usually 24-36pt works well)</li>
							</ol>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-3">
						<AccordionTrigger>Using with Microsoft Excel</AccordionTrigger>
						<AccordionContent>
							<ol className="list-decimal space-y-2 pl-5">
								<li>Install a Code 128 barcode font on your system</li>
								<li>Use this tool to generate barcode strings</li>
								<li>Copy the encoded strings to your Excel cells</li>
								<li>
									Select those cells and change the font to your Code 128 font
								</li>
								<li>Adjust font size as needed (usually 24-36pt works well)</li>
								<li>For printing, ensure "scale to fit" is turned off</li>
							</ol>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-4">
						<AccordionTrigger>Code 128 Font Resources</AccordionTrigger>
						<AccordionContent>
							<p className="mb-2">
								Here are some Code 128 barcode fonts you can use:
							</p>
							<ul className="list-disc space-y-2 pl-5">
								<li>
									<a
										href="https://www.fontspace.com/code-128-font-f11377"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center text-primary hover:underline"
									>
										Code 128 Font on Fontspace
										<ExternalLink className="ml-1 h-3 w-3" />
									</a>
								</li>
								<li>
									<a
										href="https://www.dafont.com/code-128.font"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center text-primary hover:underline"
									>
										Code 128 on DaFont
										<ExternalLink className="ml-1 h-3 w-3" />
									</a>
								</li>
								<li>
									<a
										href="https://sourceforge.net/projects/free-barcode-font/"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center text-primary hover:underline"
									>
										Free Barcode Font on SourceForge
										<ExternalLink className="ml-1 h-3 w-3" />
									</a>
								</li>
							</ul>
							<p className="mt-2 text-muted-foreground text-sm">
								Note: Make sure to check the license for any font you download
								to ensure it's appropriate for your intended use.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-5">
						<AccordionTrigger>Troubleshooting</AccordionTrigger>
						<AccordionContent>
							<h4 className="mb-1 font-medium">Barcode Not Scanning?</h4>
							<ul className="list-disc space-y-2 pl-5">
								<li>Make sure you're using a proper Code 128 font</li>
								<li>
									Ensure the font size is large enough (24-36pt is usually good)
								</li>
								<li>Check that the aspect ratio hasn't been distorted</li>
								<li>
									Make sure there's sufficient quiet zone (white space) around
									the barcode
								</li>
								<li>Try printing at a higher resolution</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
