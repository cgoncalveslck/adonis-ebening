import '../css/app.css'

window.dropHandler = function (ev) {
  //wip
  ev.preventDefault()

  const items = [...ev.dataTransfer.items]
  if (items.length > 0) {
    items.forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        console.log(file)
      }
    })
  } else {
    const files = [...ev.dataTransfer.files]
    files.forEach((file, i) => {
      // console.log(file)
    })
  }
}

window.dragOverHandler = function (ev) {
  //wip
  ev.preventDefault()

  var dropZone = document.getElementById('drop-zone')
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault()
    dropZone.classList.add('dragover')
  })

  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault()
    dropZone.classList.remove('dragover')
  })

  dropZone.addEventListener('drop', function (event) {
    event.preventDefault()
    dropZone.classList.remove('dragover')
  })
}
