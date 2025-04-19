const container = document.querySelector('#carousel')
const slidesContainer = container.querySelector('#slides-container')
const slides = container.querySelectorAll('.slide')
const indicatorsContainer = container.querySelector('#indicators-container')
const indicators = indicatorsContainer.querySelectorAll('.indicator')
const controlsContainer = container.querySelector('#controls-container')
const pauseBtn = controlsContainer.querySelector('#pause-btn')
const nextBtn = controlsContainer.querySelector('#next-btn')
const prevBtn = controlsContainer.querySelector('#prev-btn')

const SLIDES_COUNT = slides.length
const CODE_ARROW_LEFT = 'ArrowLeft'
const CODE_ARROW_RIGHT = 'ArrowRight'
const CODE_SPACE = 'Space'
const FA_PAUSE = '<i class="fas fa-pause"></i>'
const FA_PLAY = '<i class="fas fa-play"></i>'
const TIMER_INTERVAL = 2000

let currentSlide = 0
let isPlaying = true
let timerId = null
let swipeStartX = null
let swipeEndX = null

function gotoNth(n) {
  slides[currentSlide].classList.toggle('active')
  indicators[currentSlide].classList.toggle('active')
  currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT
  slides[currentSlide].classList.toggle('active')
  indicators[currentSlide].classList.toggle('active')
}

function gotoPrev() {
  gotoNth(currentSlide - 1)
}

function gotoNext() {
  gotoNth(currentSlide + 1)
}

function tick() {
  timerId = setInterval(gotoNext, TIMER_INTERVAL)
}

function pauseHandler() {
  if (!isPlaying) return
  pauseBtn.innerHTML = FA_PLAY
  isPlaying = !isPlaying
  clearInterval(timerId)
}

function playHandler() {
  pauseBtn.innerHTML = FA_PAUSE
  isPlaying = !isPlaying
  tick()
}

function pausePlayHandler() {
  isPlaying ? pauseHandler() : playHandler()
}

function prevHandler() {
  pauseHandler()
  gotoPrev()
}

function nextHandler() {
  pauseHandler()
  gotoNext()
}

function indicatorClickHandler(e) {
  const { target } = e

  if (target && target.classList.contains('indicator')) {
    pauseHandler()
    gotoNth(+target.dataset.slideTo)
  }
}

function keydownHandler(e) {
  const { code } = e
  if (code === CODE_ARROW_LEFT) prevHandler()
  if (code === CODE_ARROW_RIGHT) nextHandler()
  if (code === CODE_SPACE) {
    e.preventDefault()
    pausePlayHandler()
  }
}

function swipeStartHandler(e) {
  swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
}

function swipeEndHandler(e) {
  swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX

  if (swipeEndX - swipeStartX > 100) prevHandler()
  if (swipeEndX - swipeStartX < -100) nextHandler()
}

function initEventListeners() {
  pauseBtn.addEventListener('click', pausePlayHandler)
  nextBtn.addEventListener('click', nextHandler)
  prevBtn.addEventListener('click', prevHandler)
  indicatorsContainer.addEventListener('click', indicatorClickHandler)
  slidesContainer.addEventListener('touchstart', swipeStartHandler, { passive: true })
  slidesContainer.addEventListener('mousedown', swipeStartHandler)
  slidesContainer.addEventListener('touchend', swipeEndHandler)
  slidesContainer.addEventListener('mouseup', swipeEndHandler)
  document.addEventListener('keydown', keydownHandler)
}

function init() {
  initEventListeners()
  tick()
}

init()
