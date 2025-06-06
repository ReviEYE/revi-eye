export function extractReviewsFromHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const reviewElements = doc.querySelectorAll(
        '.sdp-review__article__list__review__content.js_reviewArticleContent'
    );

    const usernameElements = doc.querySelectorAll(
        '.sdp-review__article__list__info__user__name'
    );

    const ratingElements = doc.querySelectorAll(
        '.sdp-review__article__list__info__product-info__star-orange'
    );

    const dateElements = doc.querySelectorAll(
        '.sdp-review__article__list__info__product-info__reg-date'
    );

    const sellerNameElements = doc.querySelectorAll(
        '.sdp-review__article__list__info__product-info__seller_name'
    );

    const helpfulCountElements = doc.querySelectorAll(
        '.js_reviewArticleHelpfulCount'
    );

    const reviewCount = reviewElements.length;

    return Array.from({length: reviewCount}).map((_, index) => ({
        index,
        content: reviewElements[index]?.textContent?.trim() ?? '',
        username: usernameElements[index]?.textContent?.trim() ?? '',
        rating: parseInt(ratingElements[index]?.getAttribute('data-rating') ?? '0', 10),
        date: dateElements[index]?.textContent?.trim() ?? '',
        sellerName: sellerNameElements[index]?.textContent?.trim() ?? '',
        helpfulCount: helpfulCountElements[index]?.textContent?.trim() ?? '',
    }));
}