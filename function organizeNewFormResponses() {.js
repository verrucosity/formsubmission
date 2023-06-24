function organizeNewFormResponses() {
  var config = {
    destinationFolderId: "Insert_Folder_ID_Here",
    formFields: ["Client Name", "Work Date", "Has Problem", "Problem Description"],
    dateFieldFormat: "MM-dd-yyyy",
    problemFileName: "Problem.txt"
  };

  var form = FormApp.getActiveForm();
  var destinationFolder = DriveApp.getFolderById(config.destinationFolderId);

  var formResponses = form.getResponses();
  var alreadyProcessedFileIds = [];

  // Loop through each form response, starting with the most recent
  for (var i = formResponses.length - 1; i >= 0; i--) {
    var formResponse = formResponses[i];
    var items = formResponse.getItemResponses();

    // Initialize default values
    var formData = {
      folderName: "Unnamed Client",
      dateOfWork: "Unspecified Date",
      hasProblem: false,
      problemDescription: "No Problems"
    };

    // Loop through each item in the form response
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var title = item.getItem().getTitle();
      var response = item.getResponse();

      // Update variables based on item responses
      if (title === config.formFields[0]) formData.folderName = response;
      else if (title === config.formFields[1]) formData.dateOfWork = formatDate(new Date(response));
      else if (title === config.formFields[2]) formData.hasProblem = response === "Yes";
      else if (title === config.formFields[3] && formData.hasProblem) formData.problemDescription = response;
    }

    // Check if folder with the same name already exists
    var folder = getOrCreateFolder(destinationFolder, formData.dateOfWork + " " + formData.folderName);

    // Loop through each item again to handle file uploads
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (item.getItem().getType() == FormApp.ItemType.FILE_UPLOAD) {
        var fileResponses = item.getResponse();
        fileResponses.forEach(function(fileId) {
          if (alreadyProcessedFileIds.indexOf(fileId) == -1) {
            // Copy the file to the folder and rename it
            var file = DriveApp.getFileById(fileId);
            var newFileName = createNewFileName(formData.dateOfWork, file.getName());
            file.makeCopy(newFileName, folder);
            alreadyProcessedFileIds.push(fileId);
          }
        });
      }
    }

    // Create a text file with problem details if there was a problem
    if (formData.hasProblem) {
      folder.createFile(config.problemFileName, formData.problemDescription);
    }
  }

  // Helper function to format a date
  function formatDate(date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), config.dateFieldFormat);
  }

  // Helper function to get or create a folder
  function getOrCreateFolder(parentFolder, name) {
    var folderIterator = parentFolder.getFoldersByName(name);
    if (folderIterator.hasNext()) {
      return folderIterator.next();
    } else {
      return parentFolder.createFolder(name);
    }
  }

  // Helper function to create a new file name
  function createNewFileName(dateOfWork, originalFileName) {
    var extension = originalFileName.substr(originalFileName.lastIndexOf('.'));
    return dateOfWork + " - " + originalFileName.replace(extension, '') + extension;
  }
}
