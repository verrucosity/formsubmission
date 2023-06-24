function organizeNewFormResponses() {
  var form = FormApp.getActiveForm();
  var destinationFolder = DriveApp.getFolderById("1nFMIdHOf5kvpMtvATCiU9OlHYcxN5Y0J");

  var formResponses = form.getResponses();
  var alreadyProcessedFileIds = [];

  // Loop through each form response, starting with the most recent
  for (var i = formResponses.length - 1; i >= 0; i--) {
    var formResponse = formResponses[i];
    var items = formResponse.getItemResponses();

    // Initialize default values
    var folderName = "Nombre del cliente no especificado";
    var dateOfWork = "Fecha no especificada";
    var hasProblem = false;
    var problemDescription = "Sin problemas";

    // Loop through each item in the form response
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var title = item.getItem().getTitle();
      var response = item.getResponse();

      // Update variables based on item responses
      if (title === "Nombre del cliente") folderName = response;
      else if (title === "Fecha del trabajo") dateOfWork = formatDate(new Date(response));
      else if (title === "Algún problema?") hasProblem = response === "Sí";
      else if (title === "Describe el problema" && hasProblem) problemDescription = response;
    }

    // Check if folder with the same name already exists
    var folder = getOrCreateFolder(destinationFolder, dateOfWork + " " + folderName);

    // Loop through each item again to handle file uploads
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (item.getItem().getType() == FormApp.ItemType.FILE_UPLOAD) {
        var fileResponses = item.getResponse();
        fileResponses.forEach(function(fileId) {
          if (alreadyProcessedFileIds.indexOf(fileId) == -1) {
            // Copy the file to the folder and rename it
            var file = DriveApp.getFileById(fileId);
            var newFileName = createNewFileName(dateOfWork, file.getName());
            file.makeCopy(newFileName, folder);
            alreadyProcessedFileIds.push(fileId);
          }
        });
      }
    }

    // Create a text file with problem details if there was a problem
    if (hasProblem) {
      folder.createFile("Problema.txt", problemDescription);
    }
  }

  // Helper function to format a date
  function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return month + "-" + day + "-" + year;
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
