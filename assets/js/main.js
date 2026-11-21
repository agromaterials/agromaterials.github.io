---
---
/* Material Lab — site behaviour (no dependencies) */
/* Built from _includes/js/*.js (edit those, see CLAUDE.md "JavaScript"). Jekyll joins them in this order into this one file. */
document.addEventListener('DOMContentLoaded', function () {
{% include js/core.js %}
{% include js/publications.js %}
{% include js/calendar.js %}
{% include js/grants.js %}
{% include js/home.js %}
{% include js/motion.js %}
{% include js/search.js %}
{% include js/views.js %}
{% include js/contact.js %}
{% include js/boot.js %}
});
