var filesToUpload = [];
var noOfFilesUploaded = 0;
var title = "";
var description = "";
var recordId = "";
var entityTypecode = "";
var entityCollectionName = "";
var logicalName = "";


_Get = function (controlName) {
    var element = document.getElementById(controlName);
    if (element !== undefined)
        return element;

    return null;
};

_GetValue = function (controlName) {
    var element = _Get(controlName);
    if (element !== null) {
        return element.value;
    }

    return null;
};

GetQueryParameterByName = function (name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

SetMessage = function (controlName, value) {
    var element = _Get(controlName);
    if (element !== null)
        element.innerText = value;
};

StopFileLoading = function (e) {
    e.stopPropagation();
    e.preventDefault();
};

ArrayBufferToBase64 = function (buffer) { // Convert Array Buffer to Base 64 string
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

AttachEvents = function () {
    var fileSel = _Get("fileCtrl");
    var fileDiv = _Get("filedroplocation");
    var uploadBtn = _Get("uploadBtn");
    if (fileSel !== null) {
        fileSel.addEventListener("change", FileSelected, false);
    }
    if (fileDiv !== null) {
        fileDiv.addEventListener("dragover", FileDrag, false);
        fileDiv.addEventListener("dragleave", FileDragLeave, false);
        fileDiv.addEventListener("drop", FileSelected, false);
    }
    if (uploadBtn !== null) {
        uploadBtn.addEventListener("click", UploadFiles, false);
    }
};

UploadIndividualFile = function (file) {
    var fileReader = new FileReader();

    fileReader.onloadend = function (e) {
        var content = e.target.result;
        console.log(file.name + "--" + content.byteLength);
        UploadFileToCrm(content, file, FileUploadedSuccessfully);
    };
    fileReader.readAsArrayBuffer(file);
};


function DocumentLoaded()
{
    entityTypecode = GetQueryParameterByName("type");
    recordId = GetQueryParameterByName("id");
    if (entityTypecode == "" || entityTypecode == undefined || recordId == "" || recordId == undefined) {
        alert("Unable to identify the entity type code/Id !! You can't use the Drag/Drop functionality now.");
        return;
    }
    recordId = recordId.replace("{","").replace("}","");
    PopulateEntityInfo();
    if (entityCollectionName == "" || entityCollectionName == undefined)
    {
        alert("Some thing went wrong, Unable to identify the entity !! You can't use the Drag/Drop functionality now.");
        return;
    }
    AttachEvents();
}

function FileDragLeave(e)
{
    this.classList.remove("dragover");
    StopFileLoading(e);
}

function FileDrag(e) {
    this.classList.add("dragover");
    StopFileLoading(e);
}

function FileSelected(e) {
    this.classList.remove("dragover");
    StopFileLoading(e);

    var files = e.target.files || e.dataTransfer.files;

    for (var i = 0; i < files.length; i++) {
        filesToUpload.push(files[i]);
    }

    SetMessage("msg", "No of Files Selected : " + filesToUpload.length);
}

function UploadFiles()
{
    var filesCount=filesToUpload.length;
    if (filesCount <= 0) {
        alert("No Files to upload !! Please Drag & Drop files or use Browse button to select files.");
        return;
    }
    
  
    if (_Get("chkTitle").checked)
        title = prompt("Please provide Title for Notes");

    if (_Get("chkDescription").checked)
        description = prompt("Please provide Description for Notes");

    for (var i = 0; i < filesCount; i++) {
        UploadIndividualFile(filesToUpload[i]);
    }
    
}