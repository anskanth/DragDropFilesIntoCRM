/// <reference path="FileUploads.js" />
var WEBAPI_URI_VERSION= "/api/data/v8.2/";

function GetWebApiUrl()
{
    var clientUrl = Xrm.Page.context.getClientUrl();

    return clientUrl + WEBAPI_URI_VERSION;
}

function PopulateEntityInfo()
{
    var query = "EntityDefinitions?$select=EntitySetName,LogicalName&$filter=ObjectTypeCode eq " + entityTypecode;

    var data = RetriveDataUsingWebApi(query, undefined, false, EntityInfoRetrived);

}

function EntityInfoRetrived(data)
{
    if (data != null) {
        entityCollectionName = data.value[0].EntitySetName;
        logicalName = data.value[0].LogicalName;
    }
}

function RetriveDataUsingWebApi(webApiQuery, data, isAsync, callbackFn)
{
    var req = new XMLHttpRequest()
    req.open("GET", encodeURI(GetWebApiUrl() + webApiQuery), isAsync);
    SetRequestHeaders(req);
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (req.status == 200) {
                callbackFn(JSON.parse(req.response));
            }
            else {
                var error = JSON.parse(req.response).error;
                alert(error.message);
                return null;
            }
        }
    };
    req.send(data);
}

function UploadFileToCrm(filecontent, file, successCallback) {

    var content = ArrayBufferToBase64(filecontent);

    var data = {};
    data.filename = file.name;
    data.documentbody = content;
    data.mimetype = file.type;
    data.subject = title;
    data.notetext = description;
    data["objectid_" + logicalName + "@odata.bind"] = "/" + entityCollectionName + "(" + recordId + ")";

    var query = "/annotations";
    var req = new XMLHttpRequest()
    req.open("POST", encodeURI(GetWebApiUrl() + query), true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");

    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (req.status == 204) {
                //successCallback();
                successCallback(file);
            } else {
                var error = JSON.parse(req.response).error;
                alert(error.message);
            }
        }
    };

    req.send(JSON.stringify(data));

}

function FileUploadedSuccessfully(file)
{
    noOfFilesUploaded += 1;
    SetMessage("msg1", "File uploaded - " + file.name);
    if (noOfFilesUploaded == filesToUpload.length)
    {
        filesToUpload = [];
        noOfFilesUploaded = 0;
        setTimeout(function () { SetMessage("msg1", "Upload completed !!"); SetMessage("msg", ""); }, 1000);
    }
}

function SetRequestHeaders(req)
{
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
}