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
  data.dateString = `${data.year}/${leftZeroPad(data.month, 2)}/${leftZeroPad(data.day, 2)} ${leftZeroPad(data.hour, 2)}:${leftZeroPad(data.minute, 2)}:${leftZeroPad(data.second, 2)}`;
  if (data.dataType === 'arpt') {
    data.arpt = parts[0];
  } else {
    data.acft = parts[1];
    data.lvry = parts[0];
  }
  return data;
}

function leftZeroPad(num, count) {
  num = num.toString();
  while (count - num.length) {
    num = '0' + num;
  }
  return num;
}