// this file is for utilities only accessible by content scripts (chrome apis)

async function getFromStorage(key, defaultKey = null) {
    return await new Promise(resolve =>
        chrome.storage.local.get({ [key]: defaultKey }, result => resolve(result[key]))
    );
}