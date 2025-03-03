/**
 * Code 128 Barcode Encoder Utility
 * Based on the provided encoder with modern TypeScript enhancements
 */

// Types
export enum CodeSetName {
	A = "A",
	B = "B",
	C = "C",
}

export interface EncodingOptions {
	preferCodeC?: boolean;
	optimizeShifts?: boolean;
}

// Barcode data structure containing mappings for all three code sets
const BARCODE_DATA: [
	number, // checksum value
	string, // Code Set A value
	string, // Code Set B value
	string, // Code Set C value
	string | string[], // character(s)
][] = [
	[0, " ", " ", "00", [" ", "Â"]],
	[1, "!", "!", "01", "!"],
	[2, '"', '"', "02", '"'],
	[3, "#", "#", "03", "#"],
	[4, "$", "$", "04", "$"],
	[5, "%", "%", "05", "%"],
	[6, "&", "&", "06", "&"],
	[7, "'", "'", "07", "'"],
	[8, "(", "(", "08", "("],
	[9, ")", ")", "09", ")"],
	[10, "*", "*", "10", "*"],
	[11, "+", "+", "11", "+"],
	[12, ",", ",", "12", ","],
	[13, "-", "-", "13", "-"],
	[14, ".", ".", "14", "."],
	[15, "/", "/", "15", "/"],
	[16, "0", "0", "16", "0"],
	[17, "1", "1", "17", "1"],
	[18, "2", "2", "18", "2"],
	[19, "3", "3", "19", "3"],
	[20, "4", "4", "20", "4"],
	[21, "5", "5", "21", "5"],
	[22, "6", "6", "22", "6"],
	[23, "7", "7", "23", "7"],
	[24, "8", "8", "24", "8"],
	[25, "9", "9", "25", "9"],
	[26, ":", ":", "26", ":"],
	[27, ";", ";", "27", ";"],
	[28, "<", "<", "28", "<"],
	[29, "=", "=", "29", "="],
	[30, ">", ">", "30", ">"],
	[31, "?", "?", "31", "?"],
	[32, "@", "@", "32", "@"],
	[33, "A", "A", "33", "A"],
	[34, "B", "B", "34", "B"],
	[35, "C", "C", "35", "C"],
	[36, "D", "D", "36", "D"],
	[37, "E", "E", "37", "E"],
	[38, "F", "F", "38", "F"],
	[39, "G", "G", "39", "G"],
	[40, "H", "H", "40", "H"],
	[41, "I", "I", "41", "I"],
	[42, "J", "J", "42", "J"],
	[43, "K", "K", "43", "K"],
	[44, "L", "L", "44", "L"],
	[45, "M", "M", "45", "M"],
	[46, "N", "N", "46", "N"],
	[47, "O", "O", "47", "O"],
	[48, "P", "P", "48", "P"],
	[49, "Q", "Q", "49", "Q"],
	[50, "R", "R", "50", "R"],
	[51, "S", "S", "51", "S"],
	[52, "T", "T", "52", "T"],
	[53, "U", "U", "53", "U"],
	[54, "V", "V", "54", "V"],
	[55, "W", "W", "55", "W"],
	[56, "X", "X", "56", "X"],
	[57, "Y", "Y", "57", "Y"],
	[58, "Z", "Z", "58", "Z"],
	[59, "[", "[", "59", "["],
	[60, "\\", "\\", "60", "\\"],
	[61, "]", "]", "61", "]"],
	[62, "^", "^", "62", "^"],
	[63, "_", "_", "63", "_"],
	[64, "NUL", "`", "64", "`"],
	[65, "SOH", "a", "65", "a"],
	[66, "STX", "b", "66", "b"],
	[67, "ETX", "c", "67", "c"],
	[68, "EOT", "d", "68", "d"],
	[69, "ENQ", "e", "69", "e"],
	[70, "ACK", "f", "70", "f"],
	[71, "BEL", "g", "71", "g"],
	[72, "BS", "h", "72", "h"],
	[73, "HT", "i", "73", "i"],
	[74, "LF", "j", "74", "j"],
	[75, "VT", "k", "75", "k"],
	[76, "FF", "l", "76", "l"],
	[77, "CR", "m", "77", "m"],
	[78, "SO", "n", "78", "n"],
	[79, "SI", "o", "79", "o"],
	[80, "DLE", "p", "80", "p"],
	[81, "DC1", "q", "81", "q"],
	[82, "DC2", "r", "82", "r"],
	[83, "DC3", "s", "83", "s"],
	[84, "DC4", "t", "84", "t"],
	[85, "NAK", "u", "85", "u"],
	[86, "SYN", "v", "86", "v"],
	[87, "ETB", "w", "87", "w"],
	[88, "CAN", "x", "88", "x"],
	[89, "EM", "y", "89", "y"],
	[90, "SUB", "z", "90", "z"],
	[91, "ESC", "{", "91", "{"],
	[92, "FS", "|", "92", "|"],
	[93, "GS", "}", "93", "}"],
	[94, "RS", "~", "94", "~"],
	[95, "US", "DEL", "95", "Ã"],
	[96, "FNC 3", "FNC 3", "96", "Ä"],
	[97, "FNC 2", "FNC 2", "97", "Å"],
	[98, "Shift B", "Shift A", "98", "Æ"],
	[99, "Code C", "Code C", "99", "Ç"],
	[100, "Code B", "FNC 4", "Code B", "È"],
	[101, "FNC 4", "Code A", "Code A", "É"],
	[102, "FNC 1", "FNC 1", "FNC 1", "Ê"],
	[103, "Start Code A", "Start Code A", "Start Code A", "Ë"],
	[104, "Start Code B", "Start Code B", "Start Code B", "Ì"],
	[105, "Start Code C", "Start Code C", "Start Code C", "Í"],
];

// Stop character
const STOP_CHAR = "Î";

/**
 * Represents a single character in the Code 128 barcode
 */
class CodeSymbol {
	readonly value: string;
	readonly checksumValue: number;
	readonly code: CodeSet;
	readonly switchedCode: CodeSet;
	readonly char: string;
	readonly weight: number;
	readonly isCtrl: boolean;
	readonly isShift: boolean;
	readonly isSwitch: boolean;

	constructor(
		value: string,
		checksumValue: number,
		code: CodeSet,
		switchedCode: CodeSet | null,
		char: string,
		isCtrl: boolean,
	) {
		this.value = value;
		this.checksumValue = checksumValue;
		this.code = code;
		this.switchedCode = switchedCode || code;
		this.char = char;
		this.weight = this.calculateWeight(isCtrl, value);
		this.isCtrl = isCtrl;
		this.isShift = new Set(["Shift B", "Shift A"]).has(value);
		this.isSwitch = !!switchedCode;
	}

	private calculateWeight(isCtrl: boolean, value: string): number {
		// A symbol always has a weight of 1, its impact on the
		// encoded result length is the weight function.
		// Control characters weight is 0.
		// Code C symbols is 2 (they all encode 2 digits)
		return 1 - (isCtrl ? 0 : value.length);
	}

	toString(): string {
		return `<Code ${this.code.name}: ${this.value}>`;
	}
}

/**
 * Represents a Code Set (A, B, or C) in the Code 128 encoding
 */
class CodeSet {
	readonly name: CodeSetName;
	readonly stopChar: string;
	private _data: [number, string, string, string, string | string[]][];
	private _values: Map<
		string,
		[number, string, string, string, string | string[]]
	>;
	private _symbols: Map<string, CodeSymbol>;
	private _byIndex: string[];
	private _switchSymbols: CodeSymbol[] | null = null;

	constructor(
		name: CodeSetName,
		data: [number, string, string, string, string | string[]][],
		stopChar: string,
	) {
		this.name = name;
		this.stopChar = stopChar;
		this._data = data;
		this._values = new Map();
		this._symbols = new Map();
		this._byIndex = [];

		let column: number;
		switch (this.name) {
			case CodeSetName.A:
				column = 1;
				break;
			case CodeSetName.B:
				column = 2;
				break;
			case CodeSetName.C:
				column = 3;
				break;
		}

		for (let i = 0; i < data.length; i++) {
			this._values.set(data[i][column].toString(), data[i]);
			this._byIndex[i] = data[i][column].toString();
		}
	}

	getByIndex(index: number): CodeSymbol | null {
		if (index < 0 || index >= this._byIndex.length || !this._byIndex[index]) {
			return null;
		}
		return this.get(this._byIndex[index]);
	}

	get switchSymbols(): CodeSymbol[] {
		if (!this._switchSymbols) {
			this._switchSymbols = [
				this.get("Code A"),
				this.get("Code B"),
				this.get("Code C"),
				this.get("Shift A"),
				this.get("Shift B"),
			].filter((s): s is CodeSymbol => !!s);
		}
		return this._switchSymbols;
	}

	get(value: string): CodeSymbol | null {
		if (!this._values.has(value)) return null;

		let symbol = this._symbols.get(value);
		if (!symbol) {
			// Lazy initialization
			const data = this._values.get(value)!;
			const checksumValue = data[0];

			// Determine switched code, if any
			let switchedCode: CodeSet | null = null;

			// Using global references
			switch (value) {
				case "Shift A":
				case "Start Code A":
				case "Code A":
					switchedCode = codeSetA;
					break;
				case "Shift B":
				case "Start Code B":
				case "Code B":
					switchedCode = codeSetB;
					break;
				case "Start Code C":
				case "Code C":
					switchedCode = codeSetC;
					break;
				default:
					switchedCode = null;
			}

			// Determine if this is a control character
			let isCtrl = false;
			if (this.name === CodeSetName.A) isCtrl = checksumValue >= 64;
			else if (this.name === CodeSetName.B) isCtrl = checksumValue >= 95;
			else if (this.name === CodeSetName.C) isCtrl = checksumValue >= 100;

			// Get character representation
			let char = data[data.length - 1];
			if (Array.isArray(char)) {
				char = char[0];
			}

			symbol = new CodeSymbol(
				value,
				checksumValue,
				this,
				switchedCode,
				char as string,
				isCtrl,
			);

			this._symbols.set(value, symbol);
		}

		return symbol;
	}
}

// Initialize code sets
const codeSetA = new CodeSet(CodeSetName.A, BARCODE_DATA, STOP_CHAR);
const codeSetB = new CodeSet(CodeSetName.B, BARCODE_DATA, STOP_CHAR);
const codeSetC = new CodeSet(CodeSetName.C, BARCODE_DATA, STOP_CHAR);

// Get start codes
const startCodeA = codeSetA.get("Start Code A")!;
const startCodeB = codeSetB.get("Start Code B")!;
const startCodeC = codeSetC.get("Start Code C")!;

/**
 * Represents an encoded sequence of symbols
 */
class Encoding {
	readonly symbols: readonly CodeSymbol[];
	readonly value: string;
	readonly weight: number;
	private _chars: string | null = null;

	constructor(symbols: CodeSymbol[], _value?: string, _weight?: number) {
		// Freeze the symbols array to prevent modifications
		if (Object.freeze) {
			Object.freeze(symbols);
		}

		const value =
			_value || symbols.map((s) => (s.isCtrl ? "" : s.value)).join("");

		this.symbols = symbols;
		this.value = value;
		this.weight =
			_weight || value.length + this.calculateSymbolsWeight(symbols);
	}

	/**
	 * Creates a new Encoding with an additional symbol
	 */
	addSymbol(symbol: CodeSymbol): Encoding {
		const symbols = [...this.symbols];
		const newValue = this.value + (symbol.isCtrl ? "" : symbol.value);
		const oldSymbolsChange = this.weight - this.value.length;

		symbols.push(symbol);

		return new Encoding(
			symbols,
			newValue,
			newValue.length + oldSymbolsChange + symbol.weight,
		);
	}

	toString(): string {
		return this.symbols.join(" ");
	}

	/**
	 * Calculate weight change from adding symbols
	 */
	private calculateSymbolsWeight(symbols: CodeSymbol[]): number {
		return symbols.reduce((reduction, symbol) => {
			return reduction + symbol.weight;
		}, 0);
	}

	/**
	 * Get the last symbol in the sequence
	 */
	get lastSymbol(): CodeSymbol {
		if (!this.symbols.length) {
			throw new Error("There are no symbols yet");
		}
		return this.symbols[this.symbols.length - 1];
	}

	/**
	 * Get the current code set
	 */
	get currentCode(): CodeSet {
		if (
			this.symbols.length >= 3 &&
			this.symbols[this.symbols.length - 2].isShift
		) {
			return this.symbols[this.symbols.length - 2].code;
		}

		// switchedCode is equal to code if the symbol is not switching
		return this.lastSymbol.switchedCode;
	}

	/**
	 * Get the characters for the final encoded result
	 */
	get chars(): string {
		if (!this._chars) {
			const allChars = this.symbols.map((s) => s.char);
			const checkSumSymbol = this.getCheckSumSymbol();

			allChars.push(checkSumSymbol.char, this.currentCode.stopChar);
			this._chars = allChars.join("");
		}
		return this._chars;
	}

	/**
	 * Calculate the checksum for the encoded sequence
	 */
	private calculateChecksum(): number {
		let sum = 0;

		for (let i = 0; i < this.symbols.length; i++) {
			const position = i === 0 ? 1 : i;
			sum = sum + position * this.symbols[i].checksumValue;
		}

		return sum % 103;
	}

	/**
	 * Get the checksum symbol
	 */
	private getCheckSumSymbol(): CodeSymbol {
		const checkSum = this.calculateChecksum();
		const checkSumSymbol = this.currentCode.getByIndex(checkSum);

		if (!checkSumSymbol) {
			throw new Error(`No checksum symbol found for value ${checkSum}`);
		}

		return checkSumSymbol;
	}
}

/**
 * Helper function to add paths to weight map
 */
function addPaths(
	weight2Paths: Map<number, Encoding[]>,
	paths: Encoding[],
): void {
	for (const encoded of paths) {
		let equalWeightPaths = weight2Paths.get(encoded.weight);
		if (!equalWeightPaths) {
			equalWeightPaths = [];
			weight2Paths.set(encoded.weight, equalWeightPaths);
		}
		equalWeightPaths.push(encoded);
	}
}

/**
 * Takes one code and returns a list of codes, one for each valid encoding choice.
 * If there's no valid choice, it returns an empty list
 */
function nextStep(
	explored: Map<string, Set<CodeSymbol>>,
	value: string,
	encoded: Encoding,
): [Encoding | null, Encoding[] | null] {
	const intermediates: Encoding[] = [];
	const code = encoded.currentCode;
	const nextSymbols: CodeSymbol[] = [];

	// Get the next symbol value based on current code set
	const symbolValue = value.slice(
		encoded.value.length,
		encoded.value.length + (encoded.currentCode === codeSetC ? 2 : 1),
	);

	// Try to get the symbol directly
	const symbol = code.get(symbolValue);
	if (symbol) nextSymbols.push(symbol);

	// Create a unique key for memoization
	const exploredKey = `${encoded.currentCode.name}::${encoded.value}`;

	// Get or create the set of explored symbols for this state
	let exploredSet = explored.get(exploredKey);
	if (!exploredSet) {
		exploredSet = new Set();
		explored.set(exploredKey, exploredSet);
	}

	// Add potential code switches if we're not already switching
	if (!encoded.lastSymbol.isSwitch) {
		nextSymbols.push(...code.switchSymbols);
	}

	// Check each potential next symbol
	for (const symbol of nextSymbols) {
		// Skip if we've already explored this variation
		if (exploredSet.has(symbol)) continue;
		exploredSet.add(symbol);

		const newEncoded = encoded.addSymbol(symbol);

		// If we've encoded the full value, we're done
		if (newEncoded.value === value) {
			return [newEncoded, null];
		}

		intermediates.push(newEncoded);
	}

	return [null, intermediates];
}

/**
 * Find the optimal encoding path using weighted search
 */
function findSolutions(value: string): Encoding | null {
	// Weight to paths mapping
	const weight2Paths = new Map<number, Encoding[]>();

	// Start with three routes, one for each code set
	addPaths(weight2Paths, [
		new Encoding([startCodeB]),
		new Encoding([startCodeA]),
		new Encoding([startCodeC]),
	]);

	// Used to not solve the same sub-system multiple times
	const explored = new Map<string, Set<CodeSymbol>>();

	// Find the optimal path
	while (weight2Paths.size) {
		// Find the lightest weight
		const weights = Array.from(weight2Paths.keys());
		let lightest = weights[0];

		for (let i = 1; i < weights.length; i++) {
			if (weights[i] < lightest) lightest = weights[i];
		}

		if (lightest === undefined) break;

		// Get paths with lightest weight
		const lightestPaths = weight2Paths.get(lightest)!;
		weight2Paths.delete(lightest);

		// Process each path
		for (const encoded of lightestPaths) {
			const [solution, intermediates] = nextStep(explored, value, encoded);

			if (solution) {
				// Found a solution
				return solution;
			}

			if (intermediates) {
				// Add intermediate paths for further exploration
				addPaths(weight2Paths, intermediates);
			}
		}
	}

	return null;
}

/**
 * Encode a string to Code 128 barcode
 */
export function encodeCode128(value: string): string {
	if (!value) return "";

	const result = findSolutions(value);
	return result?.chars || "";
}

/**
 * Encode multiple strings in bulk
 */
export function encodeBulkCode128(values: string[]): string[] {
	// Create new code set instances for each bulk encoding operation
	// to avoid shared state issues
	const tempCodeSetA = new CodeSet(CodeSetName.A, BARCODE_DATA, STOP_CHAR);
	const tempCodeSetB = new CodeSet(CodeSetName.B, BARCODE_DATA, STOP_CHAR);
	const tempCodeSetC = new CodeSet(CodeSetName.C, BARCODE_DATA, STOP_CHAR);

	// Process each value with isolated code sets
	return values
		.filter((value) => !!value)
		.map((value) => {
			// Create a unique encoding for each string to prevent shared state issues
			if (!value) return "";

			// Use the same algorithm as encodeCode128 but with isolated code sets
			const startTempA = tempCodeSetA.get("Start Code A")!;
			const startTempB = tempCodeSetB.get("Start Code B")!;
			const startTempC = tempCodeSetC.get("Start Code C")!;

			// Initialize weight to paths mapping
			const weight2Paths = new Map<number, Encoding[]>();

			// Start with three routes, one for each code set
			addPaths(weight2Paths, [
				new Encoding([startTempB]),
				new Encoding([startTempA]),
				new Encoding([startTempC]),
			]);

			// Used to not solve the same sub-system multiple times
			const explored = new Map<string, Set<CodeSymbol>>();

			// Find the optimal path
			let result: Encoding | null = null;

			while (weight2Paths.size) {
				// Find the lightest weight
				const weights = Array.from(weight2Paths.keys());
				let lightest = weights[0];

				for (let i = 1; i < weights.length; i++) {
					if (weights[i] < lightest) lightest = weights[i];
				}

				if (lightest === undefined) break;

				// Get paths with lightest weight
				const lightestPaths = weight2Paths.get(lightest)!;
				weight2Paths.delete(lightest);

				// Process each path
				for (const encoded of lightestPaths) {
					const [solution, intermediates] = nextStep(explored, value, encoded);

					if (solution) {
						// Found a solution
						result = solution;
						break;
					}

					if (intermediates) {
						// Add intermediate paths for further exploration
						addPaths(weight2Paths, intermediates);
					}
				}

				if (result) break;
			}

			return result?.chars || "";
		});
}

/**
 * Class-based encoder for Code128 barcodes
 */
export class Code128Encoder {
	/**
	 * Encode a single string to Code128 barcode
	 */
	encode(value: string): string {
		return encodeCode128(value);
	}

	/**
	 * Encode multiple strings in bulk
	 *
	 * Note: This implementation creates isolated code sets for each bulk operation
	 * to prevent index collisions and shared state issues
	 */
	encodeBulk(values: string[]): string[] {
		return encodeBulkCode128(values);
	}
}

// Create singleton instance for easy import
export const barcodeEncoder = new Code128Encoder();
