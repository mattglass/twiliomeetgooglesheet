//This is a spreadsheet bound script that is also deployed as a web app

var ACCOUNT_SID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var ACCOUNT_TOKEN = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';


function readRows() {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var sheetname = "Send SMS";
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
  var rows = s.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
    
  //for (var i = 1; numRows - 1; i++) {
  for (var i = 1; i < values.length && numRows - 1; i++) {
      sendSMS(values[i][0],values[i][1],values[i][2],values[i][3],values[i][4],values[i][5],values[i][6],values[i][7],values[i][8],values[i][9],values[i][10],values[i][11],values[i][12],values[i][13],values[i][14]);
  }
}

function sendSMS(SearchDate,SearchOrigin,SearchDestination,Picks,Drops,Age,DIST,FormatNumber,Equipment,SendNum,Phrase1,Phrase2,Phrase3,LandOrCell, Shortlink){
  //URL is the callback to the current service with the message
  var url = ScriptApp.getService().getUrl() + '?MSG'+Phrase1.replace(/ /g,'+');
  Logger.log(url);
  var payload = {
    "From" : SendNum
    ,"To" : FormatNumber
    ,"Url": url
    ,"Body": Phrase1 + " " + Equipment + " " + Phrase2 + " in " + SearchOrigin + " for (" + SearchDate + ") " + Phrase3 + " " + Picks + "pu/" + Drops + "drop to " + SearchDestination + " Press " + Shortlink + " HELP or STOP"  
    ,"Method" : "GET"
  };
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(ACCOUNT_SID + ':' + ACCOUNT_TOKEN)
  };
  
  var options =
      {
        "method" : "post",
        "payload" : payload,
        "headers" : headers,
        "muteHttpExceptions" : true   //turn on or off twilio errors
      };
  Logger.log("texting to " + SendNum); 
  
    var url = 'https://api.twilio.com/2010-04-01/Accounts/'+ACCOUNT_SID+'/SMS/Messages.json';
    var response = UrlFetchApp.fetch(url, options);  
}

//make an entry point to the call back
function doGet(args){
  var msg = '';
  for (var p in args.parameters) {
    if(p.indexOf('MSG') > -1){
      msg += p.replace('MSG','');
      break;
    }
  }
  
  var t = HtmlService.createTemplateFromFile("twiml.html");
  t.msg = msg;
  var content = t.evaluate().getContent();
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.XML);
}
