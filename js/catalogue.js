document.addEventListener("DOMContentLoaded", () => {
    if (typeof dataFile === "undefined") {
        console.error("No dataFile defined. Set `const dataFile = 'yourfile.txt'` before loading catalogue.js");
        return;
    }

    fetch(dataFile)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load " + dataFile);
            return res.text();
        })
        .then(text => {
            const entries = parseData(text);
            renderCards(entries);
        })
        .catch(err => console.error(err));
});


function parseData(text) {
    const blocks = text.trim().split(/\n\s*\n/); // split on blank lines
    return blocks.map(block => {
        const lines = block.split("\n");
        const titleMatch = lines[0].match(/^\[(.*)\]$/);
        const title = titleMatch ? titleMatch[1] : "Unknown Aircraft";

        const data = {};
        lines.slice(1).forEach(line => {
            const [key, ...rest] = line.split(":");
            if (key && rest.length > 0) {
                data[key.trim()] = rest.join(":").trim();
            }
        });

        return { title, ...data };
    });
}

// Render info cards into .info-catalogue
function renderCards(entries) {
    const container = document.querySelector(".info-catalogue");
    if (!container) {
        console.error("No .info-catalogue container found in HTML");
        return;
    }

    entries.forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("info-card");

        card.innerHTML = `
      <div class="info-header">
        <h2>${entry.title}</h2>
        <p>${entry.Role || "Unknown Role"} | ${entry.Origin || "Unknown Origin"}</p>
      </div>
      <div class="info-image">
        ${entry.Link ? `<a href="${entry.Link}" target="_blank">` : ""}
          <img src="${entry.Image || "placeholder.jpg"}" alt="${entry.title}">
        ${entry.Link ? `</a>` : ""}
      </div>
      <div class="info-section">
        <h3>Specifications</h3>
        <ul>
          ${Object.keys(entry)
                .filter(k => !["title", "Role", "Origin", "Image", "Link"].includes(k))
                .map(k => `<li><strong>${k}:</strong> ${entry[k]}</li>`)
                .join("")}
        </ul>
      </div>
    `;

        container.appendChild(card);
    });
}
