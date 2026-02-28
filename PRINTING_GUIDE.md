# Printing & Export Guide

This guide explains how to use the printing and export features for the interactive worksheets.

## 1. Direct Printing

The worksheets include a optimized print layout that activates automatically when you print the page (e.g., using `Ctrl+P` or clicking the **Print** button).

### Key Features
- **Universal Isolation**: When printing, only the worksheet content is visible. All outer HTML (navbars, host page headers, etc.) is automatically hidden.
- **Style Stripping**: Parent container borders, shadows, and backgrounds are removed during print to ensure a clean white-page result.
- **Optimized Layout**: Interactive elements (like buttons, input boxes, and media players) are replaced with static, printable versions (e.g., lines for writing).

### How to Print
1. Click the **Print** button in the worksheet header.
2. The browser's print dialog will open.
3. Verify that the preview only shows the worksheet content.
4. (Optional) In the print settings, you may want to enable "Background graphics" if images are not showing, although the layout is designed to work without it.

---

## 2. Copy for Google Docs

Sometimes you may want to customize the worksheet further or share it as a Google Doc. This feature allows you to copy the entire worksheet format with one click.

### How it Works
The "Copy for Google Docs" feature generates a standalone HTML document that mimics the print layout using inline styles that are highly compatible with word processors.

### Steps to Use
1. Click the **Copy for Google Docs** button in the header.
2. A notification will appear saying "Worksheet copied!".
3. Open a new Google Doc (e.g., visit [docs.new](https://docs.new)).
4. **Paste** (`Ctrl+V`) into the document.
5. The layout, including the reading passage and activities, will be preserved.

### Developer Note
The implementation resides in `WorksheetExportActions.tsx`. It uses the `ClipboardItem` API with `text/html` to ensure that formatting is preserved when pasting into external applications.

---

## 3. Technical Overview (For Developers)

- **Isolation Logic**: Found in `index.css` under the `@media print` section. It uses the `:has()` selector to isolate the `.tj-printable-worksheet` container.
- **Print Layout**: The `WorksheetView.tsx` component contains a `hidden print:block` section that defines the printable structure.
- **Export Logic**: The `WorksheetExportActions` component handles the generation of pre-formatted HTML for the clipboard.
