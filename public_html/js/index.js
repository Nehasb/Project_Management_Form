/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var projDBname = 'COLLEGE-DB';
var projRelationname = 'PROJECT-TABLE';
var connToken = '90931776|-31949307965261456|90963019';

$('#pid').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProjidAsJsonObj() {
    var pid = $('#pid').val();
    var jsonStr = {
        pid: pid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#pname").val(data.pname);
    $("#name").val(data.name);
    $("#ad").val(data.ad);
    $("#dl").val(data.dl);
}

function resetForm() {
    $("#pid").val("");
    $("#pname").val("");
    $("#name").val("");
    $("#ad").val("");
    $("#dl").val("");
    $("#pid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#pid").focus();
}

function validateData()
{
    var pid, pname, name, ad, dl;
    pid = $('#pid').val();
    pname = $('#pname').val();
    name = $('#name').val();
    ad = $('#ad').val();
    dl = $('#dl').val();

    if (pid === '') {
        alert("Project ID missing");
        $("#pid").focus();
        return "";
    }

    if (pname === '') {
        alert("Project name missing");
        $("#pname").focus();
        return "";
    }

    if (name === '') {
        alert("Assigned to missing");
        $("#name").focus();
        return "";
    }

    if (ad === '') {
        alert("Assignment date missing");
        $("#ad").focus();
        return "";
    }

    if (dl === '') {
        alert("Deadline missing");
        $("#dl").focus();
        return "";
    }

    var jsonStrObj = {
        pid: pid,
        pname: pname,
        name: name,
        ad: ad,
        dl: dl
    };

    return JSON.stringify(jsonStrObj);
}

function getpid() {
    var pidJsonObj = getProjidAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDBname, projRelationname, pidJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400){
        $('#save').prop("disabled",false);
        $('#reset').prop("disabled",false);
        $('#pname').focus();
    }
    else if (resJsonObj.status === 200){
        $("#pid").prop("disabled",true);
        fillData(resJsonObj);
        $('#update').prop("disabled",false);
        $('#reset').prop("disabled",false);
        $('#pname').focus();     
    }  
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    
    var putRequest=createPUTRequest(connToken, jsonStrObj, projDBname, projRelationname);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#pid").focus();
}

function updateData(){
    $("#update").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projDBname, projRelationname, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#pid").focus();
}


