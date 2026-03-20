/**
 * Author bio block - displays author profile with avatar, info, bio, and social links.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const card = document.createElement('div');
  card.className = 'author-bio-card';

  // Row 0: Avatar | Name + Title + Company
  const headerRow = rows[0];
  const cols = [...headerRow.children];

  const header = document.createElement('div');
  header.className = 'author-bio-header';

  if (cols.length >= 2) {
    const avatarCol = cols[0];
    const infoCol = cols[1];

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'author-bio-avatar';
    const img = avatarCol.querySelector('img');
    if (img) avatarDiv.append(img);
    header.append(avatarDiv);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'author-bio-info';
    [...infoCol.children].forEach((el) => infoDiv.append(el));
    header.append(infoDiv);
  } else {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'author-bio-info';
    [...cols[0].children].forEach((el) => infoDiv.append(el));
    header.append(infoDiv);
  }

  card.append(header);

  // Row 1: Bio text
  if (rows.length > 1) {
    const bioRow = rows[1];
    const bioDiv = document.createElement('div');
    bioDiv.className = 'author-bio-text';
    [...bioRow.querySelectorAll('p')].forEach((p) => bioDiv.append(p));
    card.append(bioDiv);
  }

  // Row 2: Social links
  if (rows.length > 2) {
    const socialRow = rows[2];
    const links = socialRow.querySelectorAll('a');
    if (links.length > 0) {
      const socialDiv = document.createElement('div');
      socialDiv.className = 'author-bio-social';
      links.forEach((a) => {
        a.classList.add('author-bio-social-link');
        socialDiv.append(a);
      });
      card.append(socialDiv);
    }
  }

  block.textContent = '';
  block.append(card);
}
