import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const [imageCell, ...bodyCells] = [...row.children];

    const anchor = imageCell?.querySelector('a[href]');
    const dmUrl = anchor?.href || '';

    if (dmUrl) {
      const img = document.createElement('img');
      img.src = dmUrl;
      img.loading = 'lazy';
      imageCell.textContent = '';
      imageCell.append(img);
      imageCell.className = 'cards-card-image';
    } else if (imageCell) {
      imageCell.querySelectorAll('picture > img').forEach((img) => {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        img.closest('picture').replaceWith(optimizedPic);
      });
      const hasPicture = imageCell.querySelector('picture');
      const hasDmImg = imageCell.querySelector('img[data-dm-src]');
      imageCell.className = (hasPicture || hasDmImg) ? 'cards-card-image' : 'cards-card-body';
    }

    bodyCells.forEach((cell) => { cell.className = 'cards-card-body'; });
    li.append(imageCell, ...bodyCells);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
