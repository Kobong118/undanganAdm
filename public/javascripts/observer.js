export function observeVisibility(element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            callback(entry.isIntersecting);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    observer.observe(element);
}
