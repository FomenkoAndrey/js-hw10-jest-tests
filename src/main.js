(function () {
  const container = document.querySelector('#carousel');
  const slides = container.querySelectorAll('.slide');
  const indicatorsContainer = container.querySelector('#indicators-container');
  const indicatorItems = indicatorsContainer.querySelectorAll('.indicator');
  const controlsContainer = container.querySelector('#controls-container');
  const pauseBtn = controlsContainer.querySelector('#pause-btn');
  const nextBtn = controlsContainer.querySelector('#next-btn');
  const prevBtn = controlsContainer.querySelector('#prev-btn');

  const SLIDES_COUNT = slides.length;
  const CODE_ARROW_LEFT = 'ArrowLeft';
  const CODE_ARROW_RIGHT = 'ArrowRight';
  const CODE_SPACE = 'Space';
  const FA_PAUSE = '<i class="far fa-pause-circle"></i>';
  const FA_PLAY = '<i class="far fa-play-circle"></i>';
  const TIMER_INTERVAL = 2000;

  let currentSlide = 0;
  let isPlaying = true;
  let timerID = null;
  let startPosX = null;
  let endPosX = null;

  function gotoNth (n) {
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active');
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active');
  }

  function gotoPrev() {
    gotoNth(currentSlide - 1)
  }

  function gotoNext() {
    gotoNth(currentSlide + 1)
  }

  function tick() {
    timerID = setInterval(gotoNext, TIMER_INTERVAL);
  }

  function pauseHandler (){
    if (!isPlaying) return
    pauseBtn.innerHTML = FA_PLAY;
    isPlaying = !isPlaying;
    clearInterval(timerID);
  }

  function playHandler () {
    pauseBtn.innerHTML = FA_PAUSE;
    isPlaying = !isPlaying;
    tick();
  }

  function pausePlayHandler() {
    isPlaying ? pauseHandler() : playHandler()
  }

  function prevHandler () {
    pauseHandler();
    gotoPrev();
  }

  function nextHandler () {
    pauseHandler();
    gotoNext();
  }

  function indicateHandler (e) {
    const { target } = e

    if (target && target.classList.contains('indicator')) {
      pauseHandler();
      gotoNth(+target.dataset.slideTo);
    }
  }

  function pressKeyHandler (e) {
    const { code } = e
    if (code === CODE_ARROW_LEFT) prevHandler();
    if (code === CODE_ARROW_RIGHT) nextHandler();
    if (code === CODE_SPACE) {
      e.preventDefault()
      pausePlayHandler()
    }
  }

  function swipeStartHandler (e) {
    startPosX = e instanceof MouseEvent
        ? e.clientX
        : e.changedTouches[0].clientX;
  }

  function swipeEndHandler(e) {
    endPosX = e instanceof MouseEvent
        ? e.clientX
        : e.changedTouches[0].clientX;

    if (endPosX - startPosX > 100) prevHandler();
    if (endPosX - startPosX < -100) nextHandler();
  }

  function initListeners () {
    pauseBtn.addEventListener('click', pausePlayHandler);
    nextBtn.addEventListener('click', nextHandler);
    prevBtn.addEventListener('click', prevHandler);
    indicatorsContainer.addEventListener('click', indicateHandler);
    container.addEventListener('touchstart', swipeStartHandler, { passive: true });
    container.addEventListener('mousedown', swipeStartHandler);
    container.addEventListener('touchend', swipeEndHandler);
    container.addEventListener('mouseup', swipeEndHandler);
    document.addEventListener('keydown', pressKeyHandler);
  }

  function init () {
    initListeners();
    tick();
  }

  init();
}());
