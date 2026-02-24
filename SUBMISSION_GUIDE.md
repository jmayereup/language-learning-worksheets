# Google Sheets Submission Setup Guide

This guide explains how to set up a Google Apps Script to receive score submissions from the TJ Components (like `tj-pronunciation` and `tj-quiz-element`).

## 1. Create a Google Sheet
1. Open Google Sheets and create a new, blank spreadsheet.
2. At the bottom, rename the default sheet (usually `Sheet1`) to exactly: **`Submissions`** (Note the capital **S**).
3. *(Optional)* You can pre-fill the first row with headers, but the script will automatically create them for you if the sheet is completely empty: `Timestamp, Nickname, Homeroom, Student ID, Quiz Name, Score, Total Questions`.

## 2. Add the Apps Script
1. In the Google Sheet menu, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor (e.g., `function myFunction() { ... }`).
3. Paste the following code into the editor:

```javascript
/**
 * This function handles HTTP POST requests. 
 * It's triggered when the HTML form is submitted.
 * @param {Object} e - The event parameter for a POST request.
 */
function doPost(e) {
  // Use a try-catch block for robust error handling.
  try {
    // Parse the JSON data sent from the HTML form.
    const data = JSON.parse(e.postData.contents);

    // Select the spreadsheet and the specific sheet to save data to.
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');

    // FIX: Check if the sheet is empty. If getLastRow() is 0, there's no data.
    // In this case, we add the header row first.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Nickname', 'Homeroom', 'Student ID', 'Quiz Name', 'Score', 'Total Questions']);
    }

    // Append a new row with the data from the quiz.
    // The order here must match the header order.
    sheet.appendRow([
      new Date(),
      data.nickname,
      data.homeroom,
      data.studentId,
      data.quizName,
      data.score,
      data.total
    ]);

    // Return a success response to the HTML front-end.
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'message': 'Your score was submitted successfully!' 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // If an error occurs, log it for debugging purposes.
    Logger.log(error.toString());

    // Return an error response to the HTML front-end.
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'message': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
4. Click the **Save** icon (floppy disk) at the top of the editor.

## 3. Deploy the Script as a Web App
1. In the Apps Script editor, click the blue **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Under **Configuration**:
   - **Description**: Enter a name (e.g., "TJ Components Submissions").
   - **Execute as**: Select **Me** (your Google account).
   - **Who has access**: Select **Anyone**. *(This is required so students can submit scores without logging into Google).*
4. Click **Deploy**.
5. You will see a prompt for **Authorize Access**. Click it, select your Google Account, click **Advanced** at the bottom, and click **Go to Untitled project (unsafe)**. Click **Allow** to give the script permission to edit your spreadsheet.
6. Once deployed, you will be given a **Web app URL**. Copy this URL.

## 4. Connect the URL to Your Components
Paste the copied Web app URL into the `config.js` file of your components. 

For `tj-pronunciation`, create or edit `/src/tj-pronunciation/config.js`:
```javascript
export const config = {
    submissionUrl: 'YOUR_WEB_APP_URL_HERE'
};
```

Your component is now ready to successfully send data straight to your Google Sheet!

## 5. Student Submission Process
The system is designed with a "Proof of Work" mechanism:
- **Teacher Code (Optional for Reports)**: Students can generate their report card even without entering the teacher code. This allows them to see their progress immediately.
- **Updating the Code**: If a student missed the code or entered it wrong at the start, they can **update it directly on the report card screen** before submitting.
- **Submission (Locked)**: To officially submit the score to your Google Spreadsheet, the student **must** enter the correct Teacher Code (`6767`) in the report form (either at the start or on the report screen).
- **Screenshot Fallback**: If a student does not have the teacher code or enters it incorrectly, they will be prompted with an alert to **take a screenshot** of their report card and show it to you manually. This ensures that even without a "verified" database submission, you can still verify their work.

> [!TIP]
> You can change the required teacher code in `src/tj-pronunciation/index.js` by searching for the string `'6767'`.
