document.addEventListener('DOMContentLoaded', async () => {
  document.lvry = await (await fetch('/database/lvry.json')).json();
  document.arpt = await (await fetch('/database/arpt.json')).json();
  document.acft = await (await fetch('/database/acft.json')).json();
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
  document.querySelector('#acftTag').style.display = data.acft === null ? 'none' : '';
  document.querySelector('#acftTagLink').href = `/gallery.html?acft=${data.acft}`;
  document.querySelector('#arptTag').style.display = data.arpt === null ? 'none' : '';
  document.querySelector('#arptTagLink').href = `/gallery.html?arpt=${data.arpt}`;
  document.querySelector('#lvryTag').style.display = data.lvry === null ? 'none' : '';
  document.querySelector('#lvryTagLink').href = `/gallery.html?lvry=${data.lvry}`;
  document.querySelector('#arpt').innerText = data.arpt;
  document.querySelector('#acft').innerText = data.acft;
  document.querySelector('#lvry').innerText = data.lvry;
  document.querySelector('#arpt').title = document.arpt[data.arpt];
  document.querySelector('#acft').title = document.acft[data.acft];
  document.querySelector('#lvry').title = document.lvry[data.lvry] || 'Private Aircraft or Fictional Registration Number';
  data.dateString = data.dateString.replaceAll('/', '-').replace(' ', '-').replaceAll(':', '-');
  document.querySelector('#date').innerHTML = `<a href='/gallery.html?since=${data.year}-01-01&until=${data.year}-12-31' title='Search Screenshots posted on ${data.year}'>${data.year}</a>/`;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?since=${data.dateString.slice(0, 7)}-01&until=${data.year}-${leftZeroPad(data.month, 2)}-${leftZeroPad((new Date(data.year, data.month, 0)).getDate(), 2)}' title='Search Screenshots posted on ${data.year}/${leftZeroPad(data.month, 2)}'>${leftZeroPad(data.month, 2)}</a>/`;
  document.querySelector('#date').innerHTML += `<a href='/gallery.html?since=${data.dateString.slice(0, 10)}&until=${data.dateString.slice(0, 10)}'  title='Search Screenshots posted on ${data.year}/${leftZeroPad(data.month, 2)}/${leftZeroPad(data.day, 2)}'>${leftZeroPad(data.day, 2)}</a> `;
  document.querySelector('#date').innerHTML += `${data.hour}:${data.minute}`;
});

function resizeListener() {
  if (window.innerWidth >= 1800) {
    document.screenshot.src = document.screenshot.src.replace('/720p/', '/1080p/');
    window.removeEventListener('resize', resizeListener);
  }
}
