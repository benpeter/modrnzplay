/**
 * Related articles block - displays linked article cards.
 * Each row contains a link (with title, image, and description).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const list = document.createElement('ul');
  list.className = 'related-articles-list';

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const li = document.createElement('li');
    li.className = 'related-articles-item';

    const card = document.createElement('a');
    card.className = 'related-articles-card';
    card.href = link.href;

    const img = row.querySelector('img');
    if (img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'related-articles-image';
      imgWrap.append(img);
      card.append(imgWrap);
    }

    const content = document.createElement('div');
    content.className = 'related-articles-content';

    const heading = row.querySelector('h3, h2, strong');
    if (heading) {
      const title = document.createElement('p');
      title.className = 'related-articles-title';
      title.textContent = heading.textContent;
      content.append(title);
    }

    // Get description text (non-heading, non-image text)
    const allText = row.querySelectorAll('p');
    allText.forEach((p) => {
      if (!p.querySelector('img') && !p.classList.contains('related-articles-title')) {
        const desc = document.createElement('p');
        desc.className = 'related-articles-description';
        desc.textContent = p.textContent;
        content.append(desc);
      }
    });

    card.append(content);
    li.append(card);
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}
