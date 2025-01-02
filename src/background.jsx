
/*import storage from "./utils/chromeStorage";  

    chrome.runtime.onConnect.addListener(function (port) {
      console.assert(port.name === "settings");
      port.onMessage.addListener(function (msg) {
           if (msg.type == "readRPC") {
             storage.local.get(["ethRpcUrl"], (result) => {
               if (result.ethRpcUrl) {
                 port.postMessage({ rpcUrl: result.ethRpcUrl });
               }
             });
           }
       
      });
    });
 
*/