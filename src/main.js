// DOM elements selectors
const container = document.querySelector('#carousel');
const slidesContainer = container.querySelector('#slides-container')
const slides = container.querySelectorAll('.slide');
const indicatorsContainer = container.querySelector('#indicators-container');
const indicators = indicatorsContainer.querySelectorAll('.indicator');
const controlsContainer = container.querySelector('#controls-container');
const pauseBtn = controlsContainer.querySelector('#pause-btn');
const nextBtn = controlsContainer.querySelector('#next-btn');
const prevBtn = controlsContainer.querySelector('#prev-btn');

// Constants for carousel functionality
const SLIDES_COUNT = slides.length;
const CODE_ARROW_LEFT = 'ArrowLeft';
const CODE_ARROW_RIGHT = 'ArrowRight';
const CODE_SPACE = 'Space';
const FA_PAUSE = '<i class="far fa-pause-circle"></i>';
const FA_PLAY = '<i class="far fa-play-circle"></i>';
const TIMER_INTERVAL = 2000;

// Variables for carousel state
let currentSlide = 0;
let isPlaying = true;
let timerId = null;
let swipeStartX = null;
let swipeEndX = null;

// Carousel basic engine
function gotoNth(n) {
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');
  currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');
}

function gotoPrev() {
  gotoNth(currentSlide - 1)
}

function gotoNext() {
  gotoNth(currentSlide + 1)
}

// Tick -> setInterval
function tick() {
  timerId = setInterval(gotoNext, TIMER_INTERVAL);
}

// Controls
function pauseHandler() {
  if (!isPlaying) return
  pauseBtn.innerHTML = FA_PLAY;
  isPlaying = !isPlaying;
  clearInterval(timerId);
}

function playHandler() {
  pauseBtn.innerHTML = FA_PAUSE;
  isPlaying = !isPlaying;
  tick();
}

function pausePlayHandler() {
  isPlaying ? pauseHandler() : playHandler()
}

function prevHandler() {
  pauseHandler();
  gotoPrev();
}

function nextHandler() {
  pauseHandler();
  gotoNext();
}

// Indicators
function indicatorClickHandler(e) {
  const { target } = e

  if (target && target.classList.contains('indicator')) {
    pauseHandler();
    gotoNth(+target.dataset.slideTo);
  }
}

// Set keyboard controls
function keydownHandler(e) {
  const { code } = e
  if (code === CODE_ARROW_LEFT) prevHandler();
  if (code === CODE_ARROW_RIGHT) nextHandler();
  if (code === CODE_SPACE) {
    e.preventDefault()
    pausePlayHandler()
  }
}

// Add swipe support
function swipeStartHandler(e) {
  // if (e instanceof MouseEvent) {
  //   swipeStartX = e.clientX;
  //   return;
  // }
  //
  // if (e instanceof TouchEvent) {
  //   swipeStartX = e.changedTouches[0].clientX;
  // }
  swipeStartX = e instanceof MouseEvent
      ? e.clientX // MouseEvent
      : e.changedTouches[0].clientX; // TouchEvent
}

// Add swipe support
function swipeEndHandler(e) {
  // if (e instanceof MouseEvent) {
  //   swipeEndX = e.clientX;
  // } else if (e instanceof TouchEvent) {
  //   swipeEndX = e.changedTouches[0].clientX;
  // }
  swipeEndX = e instanceof MouseEvent
      ? e.clientX // MouseEvent
      : e.changedTouches[0].clientX; // TouchEvent

  if (swipeEndX - swipeStartX > 100) prevHandler();
  if (swipeEndX - swipeStartX < -100) nextHandler();
}

// Listeners activation
function initEventListeners() {
  pauseBtn.addEventListener('click', pausePlayHandler);
  nextBtn.addEventListener('click', nextHandler);
  prevBtn.addEventListener('click', prevHandler);
  indicatorsContainer.addEventListener('click', indicatorClickHandler);
  slidesContainer.addEventListener('touchstart', swipeStartHandler, { passive: true });
  slidesContainer.addEventListener('mousedown', swipeStartHandler);
  slidesContainer.addEventListener('touchend', swipeEndHandler);
  slidesContainer.addEventListener('mouseup', swipeEndHandler);
  document.addEventListener('keydown', keydownHandler);
}

// Activate controls, if javascript is enabled
function init() {
  initEventListeners();
  tick();
}

init();
