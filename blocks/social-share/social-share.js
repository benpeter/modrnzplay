/**
 * Social share block - displays social sharing links.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const list = document.createElement('ul');
  list.className = 'social-share-list';

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const li = document.createElement('li');
    li.className = 'social-share-item';

    // Detect platform from URL
    const href = link.href || '';
    if (href.includes('twitter.com') || href.includes('x.com')) {
      li.classList.add('social-share-x');
    } else if (href.includes('facebook.com')) {
      li.classList.add('social-share-facebook');
    } else if (href.includes('linkedin.com')) {
      li.classList.add('social-share-linkedin');
    }

    li.append(link);
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}
