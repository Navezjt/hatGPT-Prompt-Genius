function bigWrapper() {
  function main() {
    setTimeout(() =>
        injectScript(
          chrome.runtime.getURL("content-scripts/fetchRetrieve.js"),
          "body",
        ),
      500,
    );
    setTimeout(bridge, 500);
  }

  main();

  function bridge() {
    // this is to set up the functions when the page is ready
    //console.log("bridge")
    let isMainPage = window.location.href.split("/").length === 4;
    //console.log("ISMAINPAGE!")
    if (document.getElementById("compact")) {
      getAd();
      getAccountStatus();
    }
    else if (isMainPage) {
      setTimeout(bridge, 500);
    }
    newChatSetup();
  }

  async function getAd() {
    //console.log("Sending message to background page");
    chrome.runtime.sendMessage({ type: "ad" });
  }

  let adInterval;
  let adcontent;
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.type === "adresponse") {
        //console.log("AD RECEIVED")
        let adDiv = document.getElementById("cgpt-pg-ad");
        //console.log(adDiv)
        adcontent = request.ad;
        //console.log(adcontent)
        if (adDiv) {
          //console.log("TRUE")
          adDiv.innerHTML = adcontent;
        } else {
          adInterval = setInterval(pollAd, 1000);
        }

        function pollAd() {
          if (adDiv) {
            adDiv.innerHTML = adcontent;
            clearInterval(adInterval);
          }
        }
      }
    },
  );

  function newChatSetup() {
    let newChatButton = document.querySelector("nav").firstChild;
    newChatButton.addEventListener("click", () => {
      setTimeout(bridge, 500);
    });
  }

  // listen for page changes
  document.body.addEventListener("locationchange", bridge)
}