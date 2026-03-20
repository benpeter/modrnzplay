export default function decorate(block) {
  const pic = block.querySelector('picture');
  if (pic) {
    const section = block.closest('.section');
    if (section) {
      section.classList.add('hero-container');
    }
  }
}
