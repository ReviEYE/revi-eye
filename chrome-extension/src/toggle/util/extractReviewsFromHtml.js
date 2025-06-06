export function extractReviewsFromHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const reviewElements = doc.querySelectorAll(
        '.sdp-review__article__list__review__content.js_reviewArticleContent'
    );

    return Array.from(reviewElements).map((el) =>
        el.textContent?.trim() ?? ''
    );
}