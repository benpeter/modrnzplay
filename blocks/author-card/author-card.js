/**
 * Author card block - displays author name, avatar, and social links.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Row 0: author image + name + link
  const infoRow = rows[0];
  const img = infoRow.querySelector('img');
  const links = infoRow.querySelectorAll('a');

  const card = document.createElement('div');
  card.className = 'author-card-content';

  if (img) {
    const avatar = document.createElement('div');
    avatar.className = 'author-card-avatar';
    avatar.append(img);
    card.append(avatar);
  }

  const details = document.createElement('div');
  details.className = 'author-card-details';

  links.forEach((link) => {
    if (link.querySelector('img')) return; // skip image links already handled
    const name = document.createElement('p');
    name.className = 'author-card-name';
    name.append(link);
    details.append(name);
  });

  // Row 1: social links (optional)
  if (rows.length > 1) {
    const socialRow = rows[1];
    const socialLinks = socialRow.querySelectorAll('a');
    if (socialLinks.length > 0) {
      const social = document.createElement('ul');
      social.className = 'author-card-social';
      socialLinks.forEach((a) => {
        const li = document.createElement('li');
        li.append(a);
        social.append(li);
      });
      details.append(social);
    }
  }

  card.append(details);
  block.textContent = '';
  block.append(card);
}
