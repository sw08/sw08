function copy (text, alert) {
  navigator.clipboard.writeText(text).then(() => alert && window.alert(alert))
}
