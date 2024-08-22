const FIELD_LIMIT = 25; // Maximum fields allowed
const CHAR_LIMIT_FIELD_NAME = 256; // Field name limit
const CHAR_LIMIT_FIELD_VALUE = 1024; // Field value limit
const CHAR_LIMIT_TITLE = 256; // Title limit
const CHAR_LIMIT_DESCRIPTION = 4096; // Description limit
const CHAR_LIMIT_FOOTER = 2048; // Footer limit
const CHAR_LIMIT_AUTHOR = 256; // Author name limit
const CHAR_LIMIT_TOTAL = 6000; // Total character limit for embed

let fieldCount = 0;

function addField() {
    if (fieldCount >= FIELD_LIMIT) {
        showNotification("Exceeds max number of fields!");
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

        <button type="button" onclick="removeField(${fieldCount})">Remove Field</button>
    `;
    fieldsContainer.appendChild(fieldDiv);
}

function removeField(id) {
    const fieldDiv = document.getElementById(`field-${id}`);
    if (fieldDiv) {
        fieldDiv.remove();
        fieldCount--;
    }
}

function generateJSON() {
    const jsonData = {};

    const title = document.getElementById('title').value.trim();
    if (title.length > CHAR_LIMIT_TITLE) {
        showNotification("Exceeds max characters for title!");
        return;
    }
    if (title) jsonData.title = title;

    const description = document.getElementById('description').value.trim();
    if (description.length > CHAR_LIMIT_DESCRIPTION) {
        showNotification("Exceeds max characters for description!");
        return;
    }
    if (description) jsonData.description = description;

    const color = document.getElementById('color').value.trim();
    if (color) jsonData.color = parseInt(color);

    const footerText = document.getElementById('footerText').value.trim();
    const footerIcon = document.getElementById('footerIcon').value.trim();
    if (footerText || footerIcon) {
        if (footerText.length > CHAR_LIMIT_FOOTER) {
            showNotification("Exceeds max characters for footer text!");
            return;
        }
        jsonData.footer = {};
        if (footerText) jsonData.footer.text = footerText;
        if (footerIcon) jsonData.footer.icon_url = footerIcon;
    }

    const thumbnailUrl = document.getElementById('thumbnailUrl').value.trim();
    if (thumbnailUrl) jsonData.thumbnail = { url: thumbnailUrl };

    const authorName = document.getElementById('authorName').value.trim();
    const authorIcon = document.getElementById('authorIcon').value.trim();
    if (authorName || authorIcon) {
        if (authorName.length > CHAR_LIMIT_AUTHOR) {
            showNotification("Exceeds max characters for author name!");
            return;
        }
        jsonData.author = {};
        if (authorName) jsonData.author.name = authorName;
        if (authorIcon) jsonData.author.icon_url = authorIcon;
    }

    const fields = [];
    let totalChars = 0;

    for (let i = 1; i <= fieldCount; i++) {
        const fieldName = document.getElementById(`fieldName-${i}`)?.value.trim();
        const fieldValue = document.getElementById(`fieldValue-${i}`)?.value.trim();
        
        if (fieldName && fieldValue) {
            if (fieldName.length > CHAR_LIMIT_FIELD_NAME) {
                showNotification("Exceeds max characters for field name!");
                return;
            }
            if (fieldValue.length > CHAR_LIMIT_FIELD_VALUE) {
                showNotification("Exceeds max characters for field value!");
                return;
            }
            fields.push({ name: fieldName, value: fieldValue });
            totalChars += fieldName.length + fieldValue.length;
            if (totalChars > CHAR_LIMIT_TOTAL) {
                showNotification("Exceeds total character limit for embed!");
                return;
            }
        }
    }
    if (fields.length > 0) jsonData.fields = fields;

    document.getElementById('output').textContent = JSON.stringify([jsonData], null, 2);
}

function copyJSON() {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.textContent).then(() => {
        showNotification("JSON Copied!");
        output.classList.add('copied');
        setTimeout(() => output.classList.remove('copied'), 500);
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 5000);
}
