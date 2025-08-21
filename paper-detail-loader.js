// ABOUTME: Dynamic link loader for paper detail pages
// ABOUTME: Loads link data from papers-data.js and injects into detail pages

class PaperDetailLoader {
    constructor() {
        this.paperId = this.getPaperIdFromPage();
        this.paperData = null;
        this.init();
    }

    getPaperIdFromPage() {
        // Extract paper ID from URL or page attributes
        const path = window.location.pathname;
        const match = path.match(/paper(\d+)\.html/);
        if (match) {
            return `paper${match[1]}`;
        }
        // Fallback: check for data attribute
        const paperElement = document.querySelector('[data-paper-id]');
        return paperElement ? paperElement.dataset.paperId : null;
    }

    async init() {
        if (!this.paperId) {
            console.error('Could not determine paper ID');
            return;
        }

        // Load paper data from PAPERS_DATA
        if (typeof PAPERS_DATA !== 'undefined') {
            this.paperData = PAPERS_DATA.find(p => p.id === this.paperId);
            if (this.paperData) {
                this.updatePageWithData();
            } else {
                console.error(`Paper data not found for ID: ${this.paperId}`);
            }
        } else {
            console.error('PAPERS_DATA not loaded');
        }
    }

    updatePageWithData() {
        // Update title
        const titleElement = document.querySelector('.paper-title');
        if (titleElement && this.paperData.title) {
            titleElement.textContent = this.paperData.title;
        }

        // Update authors
        const authorsElement = document.querySelector('.paper-authors');
        if (authorsElement && this.paperData.authors) {
            authorsElement.innerHTML = this.paperData.authors;
        }

        // Update venue
        const venueElement = document.querySelector('.paper-venue');
        if (venueElement && this.paperData.venue) {
            venueElement.textContent = this.paperData.venue;
        }

        // Update links section
        this.updateLinks();

        // Update citation if exists
        this.updateCitation();
    }

    updateLinks() {
        const linksContainer = document.querySelector('.paper-links');
        if (!linksContainer || !this.paperData.links) return;

        // Clear existing links
        linksContainer.innerHTML = '';

        // Add links dynamically from papers-data.js
        Object.entries(this.paperData.links).forEach(([key, value]) => {
            if (value && key !== 'bibtex') {
                const link = document.createElement('a');
                link.href = value;
                link.className = 'paper-link-btn';
                link.target = '_blank';
                
                // Add icon and text based on link type
                const icon = this.getLinkIcon(key);
                const text = this.capitalize(key);
                link.innerHTML = `${icon} ${text}`;
                
                linksContainer.appendChild(link);
            }
        });

        // Add BibTeX button if available
        if (this.paperData.links.bibtex) {
            const bibtexBtn = document.createElement('a');
            bibtexBtn.href = '#citation';
            bibtexBtn.className = 'paper-link-btn';
            bibtexBtn.innerHTML = '<i class="fas fa-quote-right"></i> BibTeX';
            linksContainer.appendChild(bibtexBtn);
        }
    }

    updateCitation() {
        const citationBox = document.querySelector('.citation-box pre');
        if (!citationBox || !this.paperData.links || !this.paperData.links.bibtex) return;

        // Update the citation text
        citationBox.textContent = this.paperData.links.bibtex;

        // Update copy button functionality
        const copyBtn = document.querySelector('.copy-citation-btn');
        if (copyBtn) {
            copyBtn.onclick = () => this.copyCitation();
        }
    }

    getLinkIcon(linkType) {
        const icons = {
            'paper': '<i class="fas fa-file-pdf"></i>',
            'code': '<i class="fab fa-github"></i>',
            'data': '🤗',
            'slides': '<i class="fas fa-presentation"></i>',
            'poster': '<i class="fas fa-image"></i>',
            'demo': '<i class="fas fa-play-circle"></i>',
            'video': '<i class="fas fa-video"></i>',
            'project': '<i class="fas fa-globe"></i>'
        };
        return icons[linkType] || '<i class="fas fa-link"></i>';
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    copyCitation() {
        if (!this.paperData || !this.paperData.links || !this.paperData.links.bibtex) return;

        navigator.clipboard.writeText(this.paperData.links.bibtex).then(() => {
            const copyBtn = document.querySelector('.copy-citation-btn');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy citation:', err);
        });
    }
}

// Global function for backward compatibility
function copyCitation() {
    if (window.paperDetailLoader) {
        window.paperDetailLoader.copyCitation();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load papers-data.js first if not already loaded
    if (typeof PAPERS_DATA === 'undefined') {
        const script = document.createElement('script');
        script.src = '../papers-data.js';
        script.onload = () => {
            window.paperDetailLoader = new PaperDetailLoader();
        };
        document.head.appendChild(script);
    } else {
        window.paperDetailLoader = new PaperDetailLoader();
    }
});