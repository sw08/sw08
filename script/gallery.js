document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  document.byLvry = await (await fetch('/database/by_lvry.json')).json();
  document.byArpt = await (await fetch('/database/by_arpt.json')).json();
  document.byAcft = await (await fetch('/database/by_acft.json')).json();
  document.files = await (await fetch('/database/all_files.json')).json();
  document.ascending = params.get('ascending') === 'true';
  console.log(document.ascending);
  processFileNames();

  document.filtered = filter({});
  for (const [i, img] of document.filtered.entries()) {
    const div = document.createElement('div');
    div.classList.add('gallery-preview');
    div.style.backgroundImage = `url('/screenshots/360p/${img.name}')`;
    div.style.order = i;
    div.title = img.dateString;
    div.addEventListener('click', function () {
      window.location.href = `/screenshot.html?img=${img.name}`;
    });
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag');
    tagDiv.classList.add('center');
    tagDiv.classList.add('row');
    const tagh4 = document.createElement('h4');
    tagh4.style = 'margin: 0;';
    tagh4.innerText = img.dataType === 'arpt' ? img.arpt : `${img.acft}`;
    tagDiv.appendChild(tagh4);
    div.appendChild(tagDiv);
    document.querySelector('div.gallery').appendChild(div);
  }
  document.querySelector('#order').onclick = reverse;
});

// function refreshState() {
//   const params = new URLSearchParams();
//   params.append('ascending', document.ascending);
//   window.history.pushState(null, null, `?${params.toString()}`);
// }

function reverse () {
  document.ascending = !document.ascending;
  for (const [i, div] of document.querySelectorAll('div.gallery-preview').entries()) {
    div.style.order = document.ascending ? i : document.filtered.length - 1 - i;
  }
//   refreshState();
}

function processFileNames() {
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
    return document.ascending ? dateA - dateB : dateB - dateA;
  });
  document.files = files;
}

function filter (filter) {
  const result = document.files;
  return result;
  // placeholder. to be implemented
}