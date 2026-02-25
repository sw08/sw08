window.addEventListener('DOMContentLoaded', async () => {
//   document.byLvry = await (await fetch('/database/by_lvry.json')).json();
//   document.byArpt = await (await fetch('/database/by_arpt.json')).json();
//   document.byAcft = await (await fetch('/database/by_acft.json')).json();
//   document.lvry = await (await fetch('/database/lvry.json')).json();
  document.arpt = await (await fetch('/database/arpt.json')).json();
  document.acft = await (await fetch('/database/acft.json')).json();
  document.files = await (await fetch('/database/all_files.json')).json();
  document.galleryDiv = document.querySelector('main#gallery');
  const params = new URLSearchParams(window.location.search);
  document.filter = {
    arpt: params.get('arpt'),
    acft: params.get('acft'),
    lvry: params.get('lvry'),
    until: params.get('until'),
    since: params.get('since'),
    dataType: null
  };
  checkFilterValidity();
  document.ascending = params.get('ascending') === 'true';
  processFileNames();
  if (document.ascending) {
    document.files.reverse();
    document.querySelector('#orderFilter > h5').innerText = 'Order: Old to New';
  }
  document.loaded = 0;
  refreshFilter();
});

function checkFilterValidity() {
  if (document.filter.since && document.filter.until) {
    const s = new Date(document.filter.since);
    const e = new Date(document.filter.until);
    if (isNaN(s)) {
      alert('Filter is invalid: Date of "Since" filter is invalid');
      document.filter.since = null;
    }
    if (isNaN(e)) {
      alert('Filter is invalid: Date of "Until" filter is invalid');
      document.filter.until = null;
    }
    if (e - s < 0) { // order is wrong
      alert('Filter is invalid: Date of "Until" can\'t be earlier than that of "Since"');
      document.filter.since = null;
      document.filter.until = null;
    }
  }
  if (document.filter.arpt && (document.filter.acft || document.filter.lvry)) {
    alert('Filter is invalid: "Airport" filter can\' be used with "Aircraft" filter or "Livery/reg" filter');
    document.filter.arpt = null;
    document.filter.acft = null;
    document.filter.lvry = null;
  }
  if (document.filter.arpt) {
    document.filter.dataType = 'arpt';
  } else if (document.filter.acft || document.filter.lvry) {
    document.filter.dataType = 'acft';
  } else {
    document.filter.dataType = null;
  }
}

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

function loadPhoto(count) {
  for (let i = document.loaded; i < Math.min(document.loaded + count, document.filtered.length); i++) {
    const img = document.filtered[i];
    addImage(i, img);
  }
  document.loaded = Math.min(document.loaded + count, document.filtered.length);
  refreshState();
}

function refreshFilter() {
  checkFilterValidity();
  document.querySelector('main#gallery').innerHTML = '';
  document.filtered = filter();
  if (document.filtered.length === 0) {
    alert('Nothing found after search');
    window.location.href = '/gallery.html';
    return;
  }
  document.loaded = 0;
  let toLoad = 12;
  if (toLoad > document.filtered.length) toLoad = document.filtered.length;
  loadPhoto(toLoad);
  document.columnCount = getGalleryColumnCount();
  if (document.loaded < document.filtered.length && toLoad % document.columnCount) {
    toLoad = (Math.floor(toLoad / document.columnCount) + 1) * document.columnCount;
  }
  loadPhoto(toLoad - document.loaded);
  Object.keys(document.filter).forEach(x => {
    if (x === 'dataType') return;
    const filterDiv = document.querySelector(`#${x}Filter`);
    if (document.filter[x]) {
      filterDiv.style.display = '';
      filterDiv.firstElementChild.innerText = `${{ acft: 'Aircraft', arpt: 'Airport', lvry: 'Livery/Reg', since: 'Since', until: 'Until' }[x]}: ${document.filter[x].toUpperCase().replace('ARPT', 'Airport').replace('ACFT', 'Aircraft')}`;
    } else {
      filterDiv.style.display = 'none';
    }
  });
  document.querySelector('#order').onclick = reverseBtn;
}

function setFilter(data, refresh = true) {
  for (const key of Object.keys(data)) {
    document.filter[key] = data[key];
  }
  if (refresh) refreshFilter();
}

function removeFilter(data, refresh = true) {
  const temp = {};
  if (Array.isArray(data)) {
    data.forEach(x => { temp[x] = null; });
  } else {
    temp[data] = null;
  }
  if (Object.keys(document.filter).every(x => x === 'dataType' || document.filter[x] === null)) {
    document.filter.dataType = null;
  }
  setFilter(temp, false);
  if (refresh) refreshFilter();
}

function addImage(order, img) {
  const div = document.createElement('div');
  div.classList.add('gallery-preview');
  div.style.order = order;
  div.title = img.dateString;
  const linkA = document.createElement('a');
  linkA.href = `/screenshot.html?img=${img.name}`;
  const imgTag = document.createElement('img');
  imgTag.src = `/screenshots/360p/${img.name}.webp`;
  imgTag.classList.add('preview-image');
  imgTag.loading = 'lazy';
  linkA.appendChild(imgTag);
  div.appendChild(linkA);
  const tagDiv = document.createElement('div');
  tagDiv.classList.add('tag');
  tagDiv.classList.add('center');
  tagDiv.classList.add('row');
  const tagh4 = document.createElement('h4');
  tagh4.style = 'margin: 0;';
  if (img.dataType === 'arpt') {
    tagh4.innerText = img.arpt;
    tagDiv.onclick = () => { setFilter({ arpt: img.arpt }); };
    tagDiv.title = document.arpt[img.arpt];
  } else {
    tagh4.innerText = img.acft;
    tagDiv.onclick = () => { setFilter({ acft: img.acft }); };
    tagDiv.title = document.acft[img.acft];
  }
  tagDiv.appendChild(tagh4);
  div.appendChild(tagDiv);
  document.galleryDiv.appendChild(div);
}

function refreshState() {
  const params = new URLSearchParams();
  for (const item of Object.keys(document.filter)) {
    if (item !== 'dataType' && document.filter[item]) {
      params.append(item, document.filter[item]);
    }
  }
  if (document.ascending) params.append('ascending', document.ascending);
  window.history.pushState(null, null, `?${params.toString()}`);
}

function reverseBtn() {
  const params = new URLSearchParams(window.location.search);
  params.set('ascending', !document.ascending);
  window.location.href = `?${params.toString()}`;
}

function getGalleryColumnCount() {
  const child = document.galleryDiv.querySelector('.gallery-preview');
  if (!child) return 0;
  const galleryWidth = document.galleryDiv.clientWidth || document.galleryDiv.getBoundingClientRect().width;
  const childStyle = child.style;
  const childWidth = child.getBoundingClientRect().width +
    (parseFloat(childStyle.marginLeft) || 0) + (parseFloat(childStyle.marginRight) || 0);
  if (!childWidth || childWidth <= 0) return 1;
  return Math.max(1, Math.floor(galleryWidth / childWidth));
}

function processFileNames() {
  const files = [];
  for (const fn of document.files) {
    files.push(parseImageFileName(fn));
  }
  files.sort((a, b) => {
    const dateA = new Date(a.year, a.month, a.day, a.hour, a.minute, a.second);
    const dateB = new Date(b.year, b.month, b.day, b.hour, b.minute, b.second);
    return dateB - dateA;
  });
  document.files = files;
}

function filter() {
  const tempFiles = structuredClone(document.files);
  if (!document.ascending) {
    tempFiles.reverse();
  }
  let sinceTime = null;
  let untilTime = null;
  if (document.filter.since) {
    sinceTime = new Date(...document.filter.since.split('-'));
  }
  if (document.filter.until) {
    untilTime = new Date(...document.filter.until.split('-'));
  }
  let index = 0;
  if (sinceTime) {
    sinceTime.setMonth(sinceTime.getMonth() - 1);
    while (sinceTime - tempFiles[index].date > 0) {
      index++;
    }
  }
  if (untilTime) {
    untilTime.setMonth(untilTime.getMonth() - 1);
    untilTime.setHours(23);
    untilTime.setMinutes(59);
    untilTime.setSeconds(59);
  }
  let checkFilter = null;
  if (document.filter.dataType === 'arpt') {
    checkFilter = (item) => item.arpt.toUpperCase() === document.filter.arpt.toUpperCase();
  } else if (document.filter.dataType === 'acft') {
    checkFilter = (item) => ((!document.filter.acft || document.filter.acft.toUpperCase() === item.acft.toUpperCase()) && (!document.filter.lvry || document.filter.lvry.toUpperCase() === item.lvry.toUpperCase()));
  }
  const result = [];
  while (index < tempFiles.length) {
    if (untilTime && tempFiles[index].date - untilTime >= 0) {
      break;
    }
    if (document.filter.dataType) {
      if (tempFiles[index].dataType === document.filter.dataType && checkFilter(tempFiles[index])) {
        result.push(tempFiles[index]);
      }
    } else {
      result.push(tempFiles[index]);
    }
    index++;
  }
  if (!document.ascending) {
    result.reverse();
  }
  return result;
}
