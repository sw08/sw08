function copy(text, alert) {
  navigator.clipboard.writeText(text).then(() => alert && window.alert(alert));
}

function parseImageFileName(fn) {
  const parts = fn.split('_');
  const data = {
    name: fn,
    year: Number(parts.at(-2).slice(0, 4)),
    month: Number(parts.at(-2).slice(4, 6)),
    day: Number(parts.at(-2).slice(6, 8)),
    hour: Number(parts.at(-1).slice(0, 2)),
    minute: Number(parts.at(-1).slice(2, 4)),
    second: Number(parts.at(-1).slice(4, 6)),
    dataType: parts.length === 3 ? 'arpt' : 'acft'
  };
  data.dateString = `${data.year}/${data.month}/${data.day} ${data.hour}:${data.minute}:${data.second}`;
  if (data.dataType === 'arpt') {
    data.arpt = parts[0];
  } else {
    data.acft = parts[1];
    data.lvry = parts[0];
  }
  return data;
}
