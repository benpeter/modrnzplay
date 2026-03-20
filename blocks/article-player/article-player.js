/**
 * Article player block - displays a "listen to article" audio player placeholder.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const player = document.createElement('div');
  player.className = 'article-player-content';

  // Row 0: heading / label text
  const firstRow = rows[0];
  const text = firstRow.textContent.trim();

  const label = document.createElement('p');
  label.className = 'article-player-label';
  label.textContent = text || 'Listen to article';
  player.append(label);

  block.textContent = '';
  block.append(player);
}
