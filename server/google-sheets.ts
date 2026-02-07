// Google Sheets integration disabled for Vercel deployment
// Re-enable by configuring Google Sheets API credentials

export async function appendToSheet(
  spreadsheetId: string,
  sheetName: string,
  values: string[][],
): Promise<void> {
  console.log("Google Sheets integration not configured");
}

export async function isGoogleSheetsConnected(): Promise<boolean> {
  return false;
}
