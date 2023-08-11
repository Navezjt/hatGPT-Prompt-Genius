// Save a reference to the original fetch function
const fetch = (window._fetch = window._fetch || window.fetch);
window.fetch = (...t) => {
    // If the request is not for the chat backend API or moderations, just use the original fetch function
    if (
        !(
            t[0].includes("https://chat.openai.com/backend-api/conversation") ||
            t[0].includes("https://chat.openai.com/backend-api/moderations")
        )
    )
        return fetch(...t);

    try {
        // Get the options object for the request, which includes the request body
        const options = t[1];
        // Parse the request body from JSON
        const body = JSON.parse(options.body);
        if (
            body.hasOwnProperty("conversation_id") &&
            !document.querySelector("#conversationID")
        ) {
            // rather than deal with message passing, we use a DOM element which the content scripts can access
            let conversationID = body["conversation_id"];
            document.body
                .appendChild(document.createElement(`input`))
                .setAttribute("id", "conversationID");
            document
                .querySelector("#conversationID")
                .setAttribute("type", "hidden");
            document.querySelector("#conversationID").style.display = "none";
            document.querySelector("#conversationID").value = conversationID;
            return fetch(...t);
        }

        // If no prompt template has been selected, use the original fetch function
        else {
            return fetch(...t);
        }
    } catch {
        // If there was an error parsing the request body or modifying the request,
        // just use the original fetch function
        return fetch(...t);
    }
};