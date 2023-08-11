(() => {
  let oldPushState = history.pushState;
  history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };

  let oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
})();

function exportUrlChange(){
  window.postMessage(
      {
        type: "urlChange",
      },
      "*",
  );

  // basically, constantly vigils and readds the menu buttons if they disappear for whatever reason
  if (!document.getElementById("download-markdown-button")) {
    window.postMessage(
        {
          type: "readdExportButtons",
        },
        "*",
    );
  }
  if (!document.getElementById("menu-theme-editor-button")) {
    readdThemeSelect();
  }
}

document.body.addEventListener("locationchange", exportUrlChange)

