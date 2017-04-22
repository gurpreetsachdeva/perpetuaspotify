function openModal(event) {
  event.preventDefault()

  const modalSelector = event.currentTarget.getAttribute('href')
  const modal = document.querySelector(modalSelector)
  modal.classList.add('is-active')

  const focusTarget = modal.querySelector('.js-modal-focus')
  if (focusTarget) {
    focusTarget.focus()
  }
}

function closeModal(event) {
  const modal = event.target.closest('.modal')
  modal.classList.remove('is-active')
}

function setUpModals(container) {
  const openLinks = container.querySelectorAll('.js-trigger-modal')
  for (let i = 0; i < openLinks.length; i++) {
    openLinks[i].addEventListener('click', openModal)
  }

  const closeLinks = container.querySelectorAll('.js-modal-close')
  for (let i = 0; i < closeLinks.length; i++) {
    closeLinks[i].addEventListener('click', closeModal)
  }
}

function closeModalOnEscape() {
  if (document.querySelector('.modal')) {
    window.addEventListener('keyup', function(event) {
      const openModal = document.querySelector('.modal.is-active')
      if (!openModal) {
        return
      }
      if (event.keyCode === 27) { // Esc
        openModal.classList.remove('is-active')
      }
    })
  }
}

function dismissNotification(event) {
  const notification = event.target.closest('.notification')
  notification.remove()
}

function setUpNotificationDismissals() {
  const buttons = document.querySelectorAll('.js-hide-notification')
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', dismissNotification)
  }
}

function toggleTrackInfo(event) {
  const button = event.currentTarget
  button.blur()

  const container = button.closest('.js-track-info-container')
  const trackInfo = container.querySelector('.js-track-info')
  const isVisible = trackInfo.classList.contains('is-visible')

  const allTrackInfos = document.querySelectorAll('.js-track-info.is-visible')
  for (let i = 0; i < allTrackInfos.length; i++) {
    allTrackInfos[i].classList.remove('is-visible')
  }

  trackInfo.classList.toggle('is-visible', !isVisible)
}

function setUpTrackInfo(container) {
  const buttons = container.querySelectorAll('.js-track-info-toggle')
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', toggleTrackInfo)
  }
}

function toggleSubmitButton(button, disabled) {
  button.disabled = disabled
  button.classList.toggle('is-loading', disabled)
}

function onRemoteFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const button = form.querySelector('button[type=submit]')
  toggleSubmitButton(button, true)

  const req = new XMLHttpRequest()
  req.open(form.method, form.action)

  req.onload = function() {
    if (req.status === 200) {
      const targetID = form.getAttribute('data-target-id')
      const target = document.getElementById(targetID)
      target.innerHTML = req.responseText

      toggleSubmitButton(button, false)
      closeModal(event)
      setUpModals(target)
      setUpRemoteForms(target)
      setUpTrackInfo(target)
    } else {
      console.error(req.status, req.statusText)
    }
  }

  req.send(new FormData(form))
}

function setUpRemoteForms(container) {
  const forms = container.querySelectorAll('.js-remote-form')
  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', onRemoteFormSubmit)
  }
}

closeModalOnEscape()
setUpNotificationDismissals()
setUpModals(document)
setUpTrackInfo(document)
setUpRemoteForms(document)
