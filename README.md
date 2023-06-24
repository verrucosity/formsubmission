Google Forms Response Organizer


This project contains a Google Apps Script function to organize and manage responses received from a Google Form. The script processes each response, creates respective folders in Google Drive, and organizes any uploaded files into these folders. Additionally, it manages some specific form fields such as the client's name, work date, and any reported issues.

Script Functionality
The organizeNewFormResponses function operates as follows:

Retrieves responses from the currently active Google Form.
Loops through the responses starting from the most recent.
For each response, it reads the fields to gather details like client's name, date of work, and whether any issues were reported.
Checks if a folder already exists with the same name (formatted as "dateOfWork clientName") in a specified destination folder on Google Drive. If not, it creates a new folder.
If the form response contains file uploads, the function moves the files into the respective client's folder in Google Drive. Each file is renamed using the date of work and the original file name.
If an issue was reported in the form, it creates a text file named "Problema.txt" in the folder with the details of the problem.
Usage
To use this script, you should replace "Insert_Folder_ID_Here" with the ID of the Google Drive folder where you want to store the form responses.

Copy the function into the script editor in your Google Form. Run the function manually, or set up triggers to run it automatically when new responses are submitted.

Please note that the script assumes specific form fields. Adjust the function according to your Google Form's structure.

Dependencies
This script relies on the Google Apps Script environment and uses the FormApp and DriveApp services.

Contribution
Feel free to fork the project, make some updates and submit a pull request. If you encounter any issues or have questions, open an issue on GitHub.

License
Open-source, free to use and modify.
