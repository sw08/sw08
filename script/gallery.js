window.addEventListener('DOMContentLoaded', async () => {
  document.byLvry = await (await fetch('/database/by_lvry.json')).json();
  document.byArpt = await (await fetch('/database/by_arpt.json')).json();
  document.byAcft = await (await fetch('/database/by_acft.json')).json();
  document.files = await (await fetch('/database/all_files.json')).json();
  document.galleryDiv = document.querySelector('div#gallery');
  const params = new URLSearchParams(window.location.search);
  document.ascending = params.get('ascending') === 'true';
  processFileNames();
  if (document.ascending) {
    document.files.reverse();
  }
  document.loaded = 0;
  refreshFilter();
  let toLoad = 12;
  if (toLoad > document.files.length) toLoad = document.files.length;
  loadPhoto(toLoad);
  document.columnCount = getGalleryColumnCount();
  if (document.loaded < document.files.length && toLoad % document.columnCount) {
    toLoad = (Math.floor(toLoad / document.columnCount) + 1) * document.columnCount;
  }
  loadPhoto(toLoad - document.loaded);
  document.querySelector('#order').onclick = reverseBtn;
});

window.addEventListener('resize', () => {
  document.columnCount = getGalleryColumnCount();
  if (document.loaded < document.files.length && document.loaded % document.columnCount) {
    loadPhoto(document.columnCount - document.loaded % document.columnCount);
  }
}, { passive: true });

window.addEventListener('scroll', () => {
  const rect = document.galleryDiv.getBoundingClientRect();
  if (document.loaded < document.files.length && (window.innerHeight - rect.top) / rect.height >= 0.8) {
    loadPhoto(document.columnCount);
  }
}, { passive: true });

function loadPhoto (count) {
  for (let i = document.loaded; i < Math.min(document.loaded + count, document.filtered.length); i++) {
    const img = document.filtered[i];
    addImage(i, img);
  }
  document.loaded = Math.min(document.loaded + count, document.filtered.length);
  refreshState();
}

function refreshFilter () {
  document.querySelector('div#gallery').innerHTML = '';
  document.filtered = filter({});
}

function addImage (order, img) {
  const div = document.createElement('div');
  div.classList.add('gallery-preview');
  div.style.order = order;
  div.title = img.dateString;
  div.addEventListener('click', function () {
    window.location.href = `/screenshot.html?img=${img.name}`;
  });
  const imgTag = document.createElement('img');
  imgTag.src = `/screenshots/360p/${img.name}`;
  imgTag.classList.add('preview-image');
  imgTag.loading = 'lazy';
  div.appendChild(imgTag);
  const tagDiv = document.createElement('div');
  tagDiv.classList.add('tag');
  tagDiv.classList.add('center');
  tagDiv.classList.add('row');
  const tagh4 = document.createElement('h4');
  tagh4.style = 'margin: 0;';
  tagh4.innerText = img.dataType === 'arpt' ? img.arpt : `${img.acft}`;
  tagDiv.appendChild(tagh4);
  div.appendChild(tagDiv);
  document.galleryDiv.appendChild(div);
}

function refreshState () {
  const params = new URLSearchParams();
  params.append('ascending', document.ascending);
  window.history.pushState(null, null, `?${params.toString()}`);
}

function reverseBtn () {
  const params = new URLSearchParams(window.location.search);
  params.set('ascending', !document.ascending);
  window.location.href = `?${params.toString()}`;
}

function getGalleryColumnCount () {
  const child = document.galleryDiv.querySelector('.gallery-preview');
  if (!child) return 0;
  const galleryWidth = document.galleryDiv.clientWidth || document.galleryDiv.getBoundingClientRect().width;
  const childStyle = child.style;
  const childWidth = child.getBoundingClientRect().width +
    (parseFloat(childStyle.marginLeft) || 0) + (parseFloat(childStyle.marginRight) || 0);
  if (!childWidth || childWidth <= 0) return 1;
  return Math.max(1, Math.floor(galleryWidth / childWidth));
}

function processFileNames () {
  const files = [];
  for (const fn of document.files) {
    const parts = fn.split('_');
    files.push({
      name: fn,
      year: Number(parts.at(-2).slice(0, 4)),
      month: Number(parts.at(-2).slice(4, 6)),
      day: Number(parts.at(-2).slice(6, 8)),
      hour: Number(parts.at(-1).slice(0, 2)),
      minute: Number(parts.at(-1).slice(2, 4)),
      second: Number(parts.at(-1).slice(4, 6)),
      dataType: parts.length === 3 ? 'arpt' : 'acft'
    });
    files[files.length - 1].dateString = `${files.at(-1).year}/${files.at(-1).month}/${files.at(-1).day} ${files.at(-1).hour}:${files.at(-1).minute}:${files.at(-1).second}`;
    if (files[files.length - 1].dataType === 'arpt') {
      files[files.length - 1].arpt = parts[0];
    } else {
      files[files.length - 1].acft = parts[1];
      files[files.length - 1].lvry = parts[0];
    }
  }
  files.sort((a, b) => {
    const dateA = new Date(a.year, a.month, a.day, a.hour, a.minute, a.second);
    const dateB = new Date(b.year, b.month, b.day, b.hour, b.minute, b.second);
    return dateB - dateA;
  });
  document.files = files;
}

function filter (filter) {
  const result = document.files;
  return result;
  // placeholder. to be implemented
}
