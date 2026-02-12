// ===============================
// KUROHANE PORTS - MAIN APP FILE
// ===============================

let romData = [];
let availableTags = [];

// Fixed Filter Buttons (Only 3)
const FILTER_BUTTONS = [
    { label: "HyperOS", value: "HyperOS" },
    { label: "OxygenOS", value: "OxygenOS" },
    { label: "Hypermint", value: "Hypermint" }
];

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
    await loadTags();
    await loadROMs();
    renderFilters();
    renderROMs(romData);
    renderUploadTags();
});

// ===============================
// LOAD TAGS
// ===============================

async function loadTags() {
    try {
        const res = await fetch("tags.json");
        availableTags = await res.json();
    } catch (err) {
        console.error("Error loading tags:", err);
    }
}

// ===============================
// LOAD ROM DATA
// ===============================

async function loadROMs() {
    try {
        const res = await fetch("roms.json");
        romData = await res.json();
    } catch (err) {
        console.error("Error loading ROMs:", err);
    }
}

// ===============================
// RENDER FILTER BUTTONS (FIXED)
// ===============================

function renderFilters() {
    const container = document.getElementById("filter-container");
    if (!container) return;

    container.innerHTML = FILTER_BUTTONS.map((btn, index) => `
        <button 
            class="filter-btn ${index === 0 ? "active" : ""}" 
            data-filter="${btn.value}">
            ${btn.label}
        </button>
    `).join("");

    const buttons = container.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            const filteredROMs = romData.filter(rom =>
                rom.tags && rom.tags.includes(filter)
            );

            renderROMs(filteredROMs);
        });
    });
}

// ===============================
// RENDER ROM CARDS
// ===============================

function renderROMs(data) {
    const container = document.getElementById("rom-container");
    if (!container) return;

    if (!data.length) {
        container.innerHTML = "<p>No ROMs found.</p>";
        return;
    }

    container.innerHTML = data.map(rom => `
        <div class="rom-card">
            <img src="${rom.thumbnail}" alt="${rom.name}">
            <div class="rom-content">
                <h3>${rom.name}</h3>
                <p>${rom.description}</p>
                <div class="tags">
                    ${rom.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join("")}
                </div>
                <a href="${rom.download}" target="_blank" class="download-btn">
                    Download
                </a>
            </div>
        </div>
    `).join("");
}

// ===============================
// RENDER UPLOAD TAG CHECKBOXES
// ===============================

function renderUploadTags() {
    const container = document.getElementById("upload-tags");
    if (!container) return;

    container.innerHTML = availableTags.map(tag => `
        <label class="tag-option">
            <input type="checkbox" value="${tag}">
            ${tag}
        </label>
    `).join("");
}

// ===============================
// SEARCH FUNCTION (OPTIONAL)
// ===============================

function searchROMs(keyword) {
    const filtered = romData.filter(rom =>
        rom.name.toLowerCase().includes(keyword.toLowerCase())
    );
    renderROMs(filtered);
                    }
