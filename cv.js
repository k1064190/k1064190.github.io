// ABOUTME: CV and portfolio renderer for dedicated showcase page
// ABOUTME: Transforms structured metadata into accessible, interactive document listings

class CvPortfolioRenderer {
    /**
     * Initialize renderer with data source and cached DOM references.
     * # Args: data (object): Structured CV page data with primaryDocument, versions, and portfolioItems arrays.
     * # Args: root (Document): Document object used for DOM queries and element creation.
     * # Returns: void: Constructs instance state without producing a return value.
     */
    constructor(data, root = document) {
        this.data = data;
        this.root = root;
        this.fileSizeCache = new Map();
        this.heroElements = {
            updated: this.root.getElementById("primary-updated"),
            description: this.root.getElementById("primary-description"),
            download: this.root.getElementById("primary-download"),
            filesize: this.root.getElementById("primary-filesize"),
            preview: this.root.getElementById("primary-preview"),
        };
        this.portfolioElements = {
            updated: this.root.getElementById("portfolio-updated"),
            description: this.root.getElementById("portfolio-description"),
            download: this.root.getElementById("portfolio-download"),
            filesize: this.root.getElementById("portfolio-filesize"),
            preview: this.root.getElementById("portfolio-preview"),
        };
    }

    /**
     * Kick off rendering pipeline after validating required data payload.
     * # Args: none
     * # Returns: void: Populates DOM elements when data is available, otherwise emits warnings.
     */
    init() {
        if (!this.data || typeof this.data !== "object") {
            console.warn("CV_PAGE_DATA missing or invalid. Skipping render.");
            return;
        }

        if (this.data.primaryDocument) {
            this.renderDocumentSection(this.heroElements, this.data.primaryDocument, "Download CV");
        }
        if (this.data.portfolioDocument) {
            this.renderDocumentSection(this.portfolioElements, this.data.portfolioDocument, "Download Portfolio");
        }
    }

    /**
     * Render metadata and preview for a document section.
     * # Args: elements (object): Mapping of DOM nodes for updated, description, download, filesize, tags, preview.
     * # Args: documentData (object): Descriptor with downloadHref, previewSrc, tags, fileSizeBytes, description, and updatedAt properties.
     * # Args: downloadLabel (string): Label applied to the download button.
     * # Returns: void: Updates DOM elements in-place and ensures accessible labels are synced.
     */
    renderDocumentSection(elements, documentData, downloadLabel) {
        if (!elements.download) return;
        const { downloadHref, previewSrc, fileSizeBytes, description, updatedAt } = documentData;

        elements.download.href = downloadHref;
        elements.download.textContent = downloadLabel;
        elements.download.setAttribute(
            "aria-label",
            `${downloadLabel} updated ${this.formatDateLabel(updatedAt)}`
        );
        if (elements.preview) {
            elements.preview.src = previewSrc;
        }
        if (elements.description && description) {
            elements.description.textContent = description;
        }
        if (elements.updated && updatedAt) {
            elements.updated.textContent = `Updated ${this.formatDateLabel(updatedAt)}`;
        }
        if (elements.filesize) {
            elements.filesize.textContent = this.formatFileSize(fileSizeBytes);
            this.updateFileSize(downloadHref, elements.filesize);
        }
    }

    /**
     * Produce media preview element appropriate for the declared preview type.
     * # Args: item (object): Portfolio descriptor providing previewType and previewSrc fields used for media rendering.
     * # Returns: HTMLElement: Preview wrapper element containing media or fallback caption.
     */
    createPreviewElement(item) {
        const wrapper = this.root.createElement("div");
        wrapper.className = "portfolio-preview";

        if (item.previewType === "image") {
            const img = this.root.createElement("img");
            img.src = item.previewSrc;
            img.alt = `${item.title} preview image`;
            img.loading = "lazy";
            wrapper.appendChild(img);
        } else if (item.previewType === "pdf") {
            const iframe = this.root.createElement("iframe");
            iframe.src = item.previewSrc;
            iframe.loading = "lazy";
            iframe.title = `${item.title} inline PDF preview`;
            wrapper.appendChild(iframe);
        } else {
            const fallback = this.root.createElement("p");
            fallback.className = "preview-fallback";
            fallback.textContent = "Preview unavailable for this artifact.";
            wrapper.appendChild(fallback);
        }

        return wrapper;
    }

    /**
     * Convert raw file size in bytes into human-readable label.
     * # Args: bytes (number): File size in bytes, may be undefined for unknown sizes.
     * # Returns: string: Human-readable string such as "1.9 KB" or "Unknown size".
     */
    formatFileSize(bytes) {
        if (typeof bytes !== "number" || Number.isNaN(bytes) || bytes <= 0) {
            return "Calculating size…";
        }
        if (bytes < 1024) {
            return `${bytes} B`;
        }
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        }
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    }

    /**
     * Convert stored ISO date strings into friendly labels.
     * # Args: isoDate (string): ISO8601 formatted date string.
     * # Returns: string: Formatted date label in YYYY-MM-DD when parsable, otherwise returns raw input.
     */
    formatDateLabel(isoDate) {
        const parsed = new Date(isoDate);
        if (Number.isNaN(parsed.getTime())) {
            return isoDate || "Unknown date";
        }
        return parsed.toISOString().slice(0, 10);
    }

    /**
     * Convert hyphenated or lowercase tags into title-cased labels.
     * # Args: tag (string): Raw tag string such as "multimodal" or "speech-processing".
     * # Returns: string: Human-friendly label with each word capitalized.
     */
    titleizeTag(tag) {
        return String(tag)
            .split(/[-_\s]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    updateFileSize(path, targetNode) {
        if (!path) return;
        if (this.fileSizeCache.has(path)) {
            targetNode.textContent = this.formatFileSize(this.fileSizeCache.get(path));
            return;
        }

        fetch(path)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${path}: ${response.status}`);
                }
                const lengthHeader = response.headers.get("Content-Length");
                if (lengthHeader) {
                    const parsedLength = Number(lengthHeader);
                    if (!Number.isNaN(parsedLength) && parsedLength > 0) {
                        this.fileSizeCache.set(path, parsedLength);
                        targetNode.textContent = this.formatFileSize(parsedLength);
                        return null;
                    }
                }
                return response.blob().then((blob) => {
                    this.fileSizeCache.set(path, blob.size);
                    targetNode.textContent = this.formatFileSize(blob.size);
                    return null;
                });
            })
            .catch((error) => {
                console.warn(`Unable to determine file size for ${path}`, error);
                targetNode.textContent = "Unknown size";
            });
    }
}

// Initialize renderer on DOMContentLoaded with embedded data payload.
document.addEventListener("DOMContentLoaded", () => {
    if (typeof CV_PAGE_DATA === "undefined") {
        console.warn("CV_PAGE_DATA is not defined; skipping CV page render.");
        return;
    }
    const renderer = new CvPortfolioRenderer(CV_PAGE_DATA);
    renderer.init();
});
