(function(){
    document.addEventListener('DOMContentLoaded', function () {
    let id = "start";
    let button = document.getElementById(id);
    button.addEventListener('click',(event)=>{
      console.log('start button clicked');
      chrome.runtime.sendMessage({
          greeting: "popup",
          command: "start"
      }, function(response) {
          // console.log(response.farewell);
          window.close();
      });
    });
  });
})();




// function doInCurrentTab(tabCallback) {
//   chrome.tabs.query(
//       { currentWindow: true, active: true },
//       function (tabArray) { tabCallback(tabArray[0]); }
//   );
// }
//
// function injectFrameScript(tab){
//   function callback(){chrome.tabs.sendMessage(tab.id, {greeting: "frame_script"})};
//
//   chrome.tabs.executeScript(tab.id, {
//     file: 'js/frame.js',
//     allFrames: true
//   },callback);
// }

  // //Listen for messages from injected scripts
  // chrome.runtime.onMessage.addListener(
  //     function(request, sender, sendResponse) {
  //         console.log(request.greeting, sender.tab.url);
  //         //Receive data from the bug page
  //         if (request.greeting == "content_script") {
  //             if (request.command == 'take_screenshot'){
  //               console.log('take screenshot');
  //               crop = request.crop;
  //               chrome.tabs.captureVisibleTab(function(dataURL) {
  //                   openTab(dataURL, request, sender);
  //               });
  //               sendResponse({
  //                   farewell: "goodbye"
  //               });
  //             } else if (request.command == 'cancel'){
  //               console.log('cancel clipper');
  //             }
  //         }
  //         //New tab has loaded the bug form
  //         else if (request.greeting == "frame_script") {
  //             console.log("from_frame_script", request);
  //             sendResponse({
  //                 farewell: "goodbye"
  //             });
  //             injectScripts(sender.tab);
  //         }
  //         //CKE script has finished loading- send the data!
  //         else if (request.greeting == "gus_script") {
  //             console.log('send gus_script queue item', queue[sender.tab.id]);
  //             try {
  //                 sendResponse({
  //                     farewell: "data",
  //                     image: queue[sender.tab.id].image,
  //                     url: queue[sender.tab.id].url,
  //                     crop: queue[sender.tab.id].crop,
  //                     prefs: localStorage
  //                 });
  //             } catch (e) {
  //                 console.log('Problem sending data:', e);
  //                 sendResponse({
  //                     farewell: "data",
  //                     prefs: localStorage
  //                 });
  //             }
  //         }
  //         //The form was filled successfully- clean up the data.
  //         else if (request.greeting == "gus_complete") {
  //             reset(sender);
  //             sendResponse({
  //                 farewell: "reset"
  //             });
  //         }
  //     }
  // );
  //
  // //Helper to get the current tab array
  // function getCurrentTab(callback) {
  //     chrome.tabs.query({
  //         active: true,
  //         currentWindow: true
  //     }, callback);
  // }
  //
  // //Inject the content scripts to clip the bug
  // function injectContentScripts() {
  //     chrome.tabs.insertCSS(null, {
  //         file: "assets/styles/salesforce-lightning-design-system-scoped.min.css"
  //     }, function() {
  //         chrome.tabs.insertCSS(null, {
  //             file: "css/content_script.css"
  //         }, function() {
  //             chrome.tabs.executeScript(null, {
  //                 file: "js/content_script.js"
  //             }, function() {
  //                 // chrome.tabs.captureVisibleTab(sendImage);
  //             });
  //         });
  //     });
  // }
  //
  // //Inject the scripts to automatically select the bug record type
  // function injectRecordType(tab) {
  //     console.log('injectRecordType', tab);
  //     if (!tab) {
  //         getCurrentTab(function(tabs) {
  //             injectRecordType(tabs[0]);
  //         });
  //     } else {
  //         chrome.tabs.executeScript(tab.id, {
  //             file: "js/recordtypeselect.js",
  //             allFrames: true,
  //             runAt: "document_end"
  //         }, function() {});
  //     }
  // }
  //
  // //Inject the scripts to fill the bug form
  // function injectScripts(tab) {
  //     console.log("injectScripts", tab);
  //     if (!tab) {
  //         getCurrentTab(function(tabs) {
  //             injectScripts(tabs[0]);
  //         });
  //     } else {
  //         chrome.tabs.insertCSS(tab.id, {
  //             file: "assets/styles/salesforce-lightning-design-system-scoped.min.css"
  //         }, function() {
  //             chrome.tabs.insertCSS(tab.id, {
  //                 file: "css/content_script.css"
  //             }, function() {
  //                 chrome.tabs.executeScript(tab.id, {
  //                     file: "js/gus_script.js",
  //                     allFrames: true,
  //                     frameId: 0,
  //                     runAt: "document_idle"
  //                 }, function() {
  //                     chrome.tabs.onUpdated.removeListener(tabOnUpdated); //stop listening to all the tab updates to prevent pressing the recordtype select button the second time through.
  //                 });
  //             });
  //         });
  //     }
  // }
  //
  // //Open the new bug form tab
  // function openTab(dataURL, request, sender) {
  //     chrome.tabs.create({
  //         url: "https://gus.my.salesforce.com/setup/ui/recordtypeselect.jsp?ent=01IT0000000CoP3&retURL=%2Fa07%2Fo&save_new_url=%2Fa07%2Fe%3FretURL%3D%252Fa07%252Fo"
  //     }, function(tab) {
  //
  //         //Store the data for this tab in the queue until the tab is loaded and ready.
  //         console.log('tab created', tab);
  //         queue[tab.id] = {}; //initialize the object for this new tab
  //         queue[tab.id].crop = request.crop; //store the crop data
  //         queue[tab.id].image = dataURL; //store image data
  //         queue[tab.id].url = sender.tab.url; //store the url of the original tab
  //
  //         //when the new tab is loaded load the script
  //         chrome.tabs.onUpdated.addListener(tabOnUpdated);
  //     });
  // }
  //
  // //Clean up the queue on success
  // function reset(sender) {
  //     delete queue[sender.tab.id];
  // }
  //
  // //Listen for the newly created tab to update
  // function tabOnUpdated(tabId, changeInfo, tab) {
  //     // console.log('tab onUpdated', tabId, changeInfo, tab);
  //     //The record type selection page has loaded- inject the record type scripts
  //     if (tab.url.includes('https://gus.my.salesforce.com/setup/ui/recordtypeselect.jsp')) {
  //         injectRecordType(tab);
  //     }
  // }