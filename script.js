const FIELD_LIMIT = 25; // Maximum number of fields
const CHAR_LIMIT_TITLE = 256;
const CHAR_LIMIT_DESCRIPTION = 4096;
const CHAR_LIMIT_FOOTER = 2048;
const CHAR_LIMIT_AUTHOR = 256;
const CHAR_LIMIT_FIELD_NAME = 256;
const CHAR_LIMIT_FIELD_VALUE = 1024;

let fieldCount = 0;

// Add CSS for speech bubble
function addSpeechBubbleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .speech-bubble-container {
            position: relative;
            display: inline-block;
        }
        .speech-bubble {
            visibility: hidden;
            width: 80px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 70%; /* Position slightly above the element */
            left: 50%;
            margin-left: -40px; /* Center the bubble */
            opacity: 0;
            transition: opacity 0.3s;
        }
        .speech-bubble::after {
            content: "";
            position: absolute;
            top: 70%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }
        .speech-bubble-container:hover .speech-bubble {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

addSpeechBubbleCSS();

function addField() {
    if (fieldCount >= FIELD_LIMIT) {
        showNotification("Maximum number of fields reached!");
        return;
    }
    fieldCount++;
    const fieldsContainer = document.getElementById('fields');
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field-item';
    fieldDiv.id = `field-${fieldCount}`;
    fieldDiv.innerHTML = `
        <label for="fieldName-${fieldCount}">Field Name:</label>
        <input type="text" id="fieldName-${fieldCount}" maxlength="${CHAR_LIMIT_FIELD_NAME}">

        <label for="fieldValue-${fieldCount}">Field Value:</label>
        <textarea id="fieldValue-${fieldCount}" maxlength="${CHAR_LIMIT_FIELD_VALUE}"></textarea>

        <div class="toggle-switch">
            <div class="speech-bubble-container">
                <input type="checkbox" id="inline-${fieldCount}">
                <label for="inline-${fieldCount}"></label>
                <div class="speech-bubble">Inline</div>
            </div>
        </div>

        <button type="button" onclick="removeField(${fieldCount})">Remove Field</button>
    `;
    fieldsContainer.appendChild(fieldDiv);
}

function removeField(count) {
    const fieldDiv = document.getElementById(`field-${count}`);
    if (fieldDiv) {
        fieldDiv.remove();
        fieldCount--;
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function copyJSON() {
    const output = document.getElementById('output');
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    output.classList.add('copied');
    setTimeout(() => {
        output.classList.remove('copied');
    }, 1000);
}

function generateJSON() {
    const jsonData = {};

    const title = document.getElementById('title')?.value.trim();
    if (title) {
        if (title.length > CHAR_LIMIT_TITLE) {
            showNotification("Exceeds max characters for title!");
            return;
        }
        jsonData.title = title;
    }

    const description = document.getElementById('description')?.value.trim();
    if (description) {
        if (description.length > CHAR_LIMIT_DESCRIPTION) {
            showNotification("Exceeds max characters for description!");
            return;
        }
        jsonData.description = description;
    }

    const color = document.getElementById('color')?.value.trim();
    if (color) {
        jsonData.color = parseInt(color, 10);
    }

    const footerText = document.getElementById('footerText')?.value.trim();
    if (footerText) {
        if (footerText.length > CHAR_LIMIT_FOOTER) {
            showNotification("Exceeds max characters for footer text!");
            return;
        }
        jsonData.footer = { text: footerText };
    }

    const footerIcon = document.getElementById('footerIcon')?.value.trim();
    if (footerIcon) {
        jsonData.footer = jsonData.footer || {};
        jsonData.footer.icon_url = footerIcon;
    }

    const thumbnailUrl = document.getElementById('thumbnailUrl')?.value.trim();
    if (thumbnailUrl) {
        jsonData.thumbnail = { url: thumbnailUrl };
    }

    const imageUrl = document.getElementById('imageUrl')?.value.trim(); // New field
    if (imageUrl) {
        jsonData.image = { url: imageUrl };
    }

    const authorName = document.getElementById('authorName')?.value.trim();
    if (authorName) {
        if (authorName.length > CHAR_LIMIT_AUTHOR) {
            showNotification("Exceeds max characters for author name!");
            return;
        }
        jsonData.author = { name: authorName };
    }

    const authorIcon = document.getElementById('authorIcon')?.value.trim();
    if (authorIcon) {
        jsonData.author = jsonData.author || {};
        jsonData.author.icon_url = authorIcon;
    }

    const fields = [];
    let totalChars = 0;

    for (let i = 1; i <= fieldCount; i++) {
        const fieldName = document.getElementById(`fieldName-${i}`)?.value.trim();
        const fieldValue = document.getElementById(`fieldValue-${i}`)?.value.trim();
        const isInline = document.getElementById(`inline-${i}`)?.checked;

        if (fieldName && fieldValue) {
            if (fieldName.length > CHAR_LIMIT_FIELD_NAME) {
                showNotification("Exceeds max characters for field name!");
                return;
            }
            if (fieldValue.length > CHAR_LIMIT_FIELD_VALUE) {
                showNotification("Exceeds max characters for field value!");
                return;
            }
            const fieldObj = { name: fieldName, value: fieldValue };
            if (isInline) {
                fieldObj.inline = true;
            }
            fields.push(fieldObj);
            totalChars += fieldName.length + fieldValue.length;
            if (totalChars > 6000) {
                showNotification("Exceeds total character limit for embed!");
                return;
            }
        }
    }
    if (fields.length > 0) jsonData.fields = fields;

    document.getElementById('output').textContent = JSON.stringify([jsonData], null, 2);
}
