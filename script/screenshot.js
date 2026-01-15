document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('img')) return (window.location.href = '/404.html');
  document.querySelector('a#saveLink').href = `/screenshots/1080p/${params.get('img')}.webp`;
  document.querySelector('a#saveLink').download = `${params.get('img')}.webp`;
  document.screenshot = document.querySelector('img#screenshot');
  if (window.innerWidth >= 1800) {
    document.screenshot.src = `/screenshots/1080p/${params.get('img')}.webp`;
  } else {
    document.screenshot.src = `/screenshots/720p/${params.get('img')}.webp`;
    if (screen.width >= 1800) {
      window.addEventListener('resize', resizeListener);
    }
  }
  const data = parseImageFileName(params.get('img'));
  document.querySelector('#acftTag').style.display = data.acft === undefined ? 'none' : '';
  document.querySelector('#acftTagLink').href = `/gallery.html?acft=${data.acft}`;
  document.querySelector('#arptTag').style.display = data.arpt === undefined ? 'none' : '';
  document.querySelector('#arptTagLink').href = `/gallery.html?arpt=${data.arpt}`;
  document.querySelector('#lvryTag').style.display = data.lvry === undefined ? 'none' : '';
  document.querySelector('#lvryTagLink').href = `/gallery.html?lvry=${data.lvry}`;
  document.querySelector('#arpt').innerText = data.arpt;
  document.querySelector('#acft').innerText = data.acft;
  document.querySelector('#lvry').innerText = data.lvry;
  data.dateString = data.dateString.replaceAll('/', '-').replace(' ', '-').replaceAll(':', '-');
  document.querySelector('#date').innerHTML = `<a href='/gallery.html?at=${data.dateString.slice(0, 4)}'>${data.year}</a>/`;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?at=${data.dateString.slice(0, 7)}'>${data.month}</a>/`;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?at=${data.dateString.slice(0, 10)}'>${data.day}</a> `;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?at=${data.dateString.slice(0, 13)}'>${data.hour}</a>:`;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?at=${data.dateString.slice(0, 16)}'>${data.minute}</a>`;
});

function resizeListener () {
  if (window.innerWidth >= 1800) {
    document.screenshot.src = document.screenshot.src.replace('/720p/', '/1080p/');
    window.removeEventListener('resize', resizeListener);
  }
}
