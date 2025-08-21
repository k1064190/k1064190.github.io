// ABOUTME: Dynamic paper loading system for portfolio website
// ABOUTME: Loads papers from embedded data and handles filtering/sorting

class PaperManager {
    constructor() {
        this.papers = [];
        this.currentFilter = "all";
        this.init();
    }

    async init() {
        await this.loadPapers();
        this.setupFilterButtons();
        this.renderPapers();
    }

    async loadPapers() {
        // Load papers from embedded data
        if (typeof PAPERS_DATA !== "undefined") {
            this.papers = PAPERS_DATA.sort((a, b) => {
                // First priority: non-"Under Review" papers come first
                const aIsUnderReview = a.venue === "Under Review";
                const bIsUnderReview = b.venue === "Under Review";

                if (aIsUnderReview !== bIsUnderReview) {
                    return aIsUnderReview ? 1 : -1; // non-Under Review papers first
                }

                // Second priority: sort by order field
                if (a.order !== b.order) return a.order - b.order;

                // Third priority: sort by year (newest first)
                return b.year - a.year;
            });
        } else {
            console.error("PAPERS_DATA not found. Please ensure papers-data.js is loaded.");
            this.papers = [];
        }
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                // Update active state
                filterButtons.forEach((btn) => btn.classList.remove("active"));
                e.target.classList.add("active");

                // Apply filter
                this.currentFilter = e.target.dataset.filter;
                this.renderPapers();
            });
        });
    }

    renderPapers() {
        const grid = document.getElementById("publication-grid");
        grid.innerHTML = "";

        const filteredPapers = this.filterPapers();

        if (filteredPapers.length === 0) {
            grid.innerHTML =
                '<p class="no-papers">No papers found in this category.</p>';
            return;
        }

        let currentYear = null;
        let animationIndex = 0;

        filteredPapers.forEach((paper) => {
            // Add year divider if year changes
            if (paper.year !== currentYear) {
                currentYear = paper.year;
                const yearDivider = document.createElement("div");
                yearDivider.className = "year-divider";
                yearDivider.innerHTML = `
                    <div class="year-line"></div>
                    <span class="year-label">${currentYear}</span>
                `;
                grid.appendChild(yearDivider);
            }

            const card = this.createPaperCard(paper);
            // Add staggered animation
            card.style.animationDelay = `${animationIndex * 0.1}s`;
            animationIndex++;
            grid.appendChild(card);
        });
    }

    filterPapers() {
        if (this.currentFilter === "all") {
            return this.papers;
        }
        return this.papers.filter(
            (paper) =>
                paper.categories &&
                paper.categories.includes(this.currentFilter)
        );
    }

    createPaperCard(paper) {
        const card = document.createElement("div");
        card.className = `publication-card ${
            paper.highlight ? "highlight" : ""
        }`;

        // Create category badges
        const categoryBadges = paper.categories
            .map(
                (cat) =>
                    `<span class="category-badge ${cat}">${this.getCategoryName(
                        cat
                    )}</span>`
            )
            .join(" ");

        // Create links HTML
        const linksHtml = Object.entries(paper.links)
            .filter(([key, value]) => value && key !== "bibtex")
            .map(([key, value]) => {
                const icon = this.getLinkIcon(key);
                return `<a href="${value}" class="pub-link" target="_blank">${icon} ${this.capitalize(
                    key
                )}</a>`;
            })
            .join("");

        // Add BibTeX button if available
        const bibtexButton = paper.links.bibtex
            ? `<button class="pub-link bibtex-btn" onclick="paperManager.showBibtex('${paper.id}')"><i class="fas fa-quote-right"></i> BibTeX</button>`
            : "";

        // Make title clickable if detail page exists
        const titleElement = paper.detailPage
            ? `<a href="${paper.detailPage}" class="publication-title-link"><h3 class="publication-title">${paper.title}</h3></a>`
            : `<h3 class="publication-title">${paper.title}</h3>`;

        card.innerHTML = `
            <div class="publication-year">${paper.year}</div>
            <div class="category-badges">${categoryBadges}</div>
            ${
                paper.image
                    ? `<div class="publication-image"><img src="${paper.image}" alt="${paper.title} figure" /></div>`
                    : ""
            }
            ${titleElement}
            <p class="publication-authors">${paper.authors}</p>
            <p class="publication-venue">${paper.venue}</p>
            ${
                paper.abstract
                    ? `<p class="publication-abstract">${paper.abstract.substring(
                          0,
                          150
                      )}...</p>`
                    : ""
            }
            <div class="publication-links">
                ${linksHtml}
                ${bibtexButton}
            </div>
        `;

        return card;
    }

    getCategoryName(category) {
        const names = {
            multimodal: "Multimodal",
            speech: "Speech",
            reasoning: "Reasoning",
            realtime: "Real-Time",
            etc: "ETC",
        };
        return names[category] || category;
    }

    getLinkIcon(linkType) {
        const icons = {
            paper: '<i class="fas fa-file-pdf"></i>',
            code: '<i class="fab fa-github"></i>',
            data: "🤗",
            slides: '<i class="fas fa-presentation"></i>',
            poster: '<i class="fas fa-image"></i>',
            demo: '<i class="fas fa-play-circle"></i>',
            video: '<i class="fas fa-video"></i>',
        };
        return icons[linkType] || '<i class="fas fa-link"></i>';
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showBibtex(paperId) {
        const paper = this.papers.find((p) => p.id === paperId);
        if (!paper || !paper.links.bibtex) return;

        // Create modal
        const modal = document.createElement("div");
        modal.className = "bibtex-modal";
        modal.innerHTML = `
            <div class="bibtex-content">
                <h3>BibTeX Citation</h3>
                <pre>${paper.links.bibtex}</pre>
                <button class="copy-btn" onclick="paperManager.copyBibtex('${paperId}')">
                    <i class="fas fa-copy"></i> Copy to Clipboard
                </button>
                <button class="close-btn" onclick="paperManager.closeBibtex()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) this.closeBibtex();
        });
    }

    copyBibtex(paperId) {
        const paper = this.papers.find((p) => p.id === paperId);
        if (!paper || !paper.links.bibtex) return;

        navigator.clipboard.writeText(paper.links.bibtex).then(() => {
            const copyBtn = document.querySelector(".copy-btn");
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML =
                    '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        });
    }

    closeBibtex() {
        const modal = document.querySelector(".bibtex-modal");
        if (modal) modal.remove();
    }
}

// Initialize when DOM is loaded
let paperManager;
document.addEventListener("DOMContentLoaded", () => {
    paperManager = new PaperManager();
});
