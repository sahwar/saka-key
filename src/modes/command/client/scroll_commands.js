require('smoothscroll-polyfill').polyfill();

// TODO: Replace smoothscroll-polyfill implementation with a custom implementation
// Currently, scroll down, left, right, up use small custom scroll implementation
// but scroll page/half page uses polyfill, which is large and only scrolls documentElement

let lastAnimationFrame;
let scrollStep = 20;
let currentScrollElement = calculateCurrentScrollElement();
let scrollFunction = scrollSmooth;
let behavior = 'smooth';

export function initScrolling (_smoothScroll, _scrollStep) {
  scrollStep = _scrollStep;
  scrollFunction = _smoothScroll ? scrollSmooth : scrollRegular;
  behavior = _smoothScroll ? 'smooth' : 'instant';
}

function scroll (element, repeat, step, direction) {
  if (!repeat) {
    if (!scrollsVertically(element)) {
      console.log(element, "doesn't scroll vertically");
      currentScrollElement = element = calculateCurrentScrollElement();
    }
  }
  scrollFunction(element, repeat, step, direction);
}

/**
 * Scrolls the selected element smoothly. Works around the quirks of keydown events.
 * The first time a key is pressed (and held), a keydown event is fired immediately.
 * After that, there is a delay before the 2nd keydown event is fired.
 * The 3rd and all subsequent keydown events fire in rapid succession.
 * event.repeat is false for the first keydown event, but true for all others
 * The delay (70 and 500) are carefully selected to keep scrolling smooth but
 * prevent unexpected scrolling after the user has released the scroll key.
 * Relying on keyup events exclusively to stop scrolling is unreliable.
 */
function scrollSmooth (element, repeat, step, direction) {
  cancelAnimationFrame(lastAnimationFrame);
  let startTime;
  const delay = repeat ? 70 : 500;
  const doScroll = (curTime) => {
    startTime = startTime || curTime;
    element[direction] += step;
    if (curTime - startTime < delay) {
      lastAnimationFrame = requestAnimationFrame(doScroll);
    } else {
      cancelAnimationFrame(lastAnimationFrame);
    }
  };
  requestAnimationFrame(doScroll);
};

/**
 * cancelScroll should be called when the user releases the scroll key to stop the
 * smooth scrolling process. Otherwise, scrolling would unexpectedly continue.
 */
export function cancelScroll () {
  cancelAnimationFrame(lastAnimationFrame);
}

/** Scrolls the selected element immediately */
function scrollRegular (element, repeat, step, direction) {
  element[direction] += step;
}

// TODO: the implementation below makes me feel guilty... but there's no better way
/** returns true if an element scrolls vertically, false otherwise */
function scrollsVertically (element) {
  const yStart = element.scrollTop;
  element.scrollTop += 1;
  const yAfterScrollDown = element.scrollTop;
  element.scrollTop -= 1;
  const yAfterScrollUp = element.scrollTop;
  return yStart !== yAfterScrollDown || yStart !== yAfterScrollUp;
}

/**
 * Returns the largest scrollable element that is the root element or one of its children
 * @param {HTMLElement} element - the root element
 * @param {number} depth - the maximum depth, pass -1 to indicate no limit,
 * depth = 8 is just large enough for gmail
 */
function largestScrollableElement (element, depth = 8) {
  function _largestScrollableElement (element, depth) {
    if (depth === 0) return;
    if (!element) return;
    if (getComputedStyle(element).overflow === 'hidden') return;
    if (scrollsVertically(element)) {
      const rect = element.getBoundingClientRect();
      const area = rect.width * rect.height;
      return [element, area];
    }
    let largestFound;
    [...element.children]
      .map((child) => _largestScrollableElement(child, depth - 1))
      .forEach((scrollElementInfo) => {
        if (scrollElementInfo) {
          if (!largestFound) {
            largestFound = scrollElementInfo;
          } else {
            if (scrollElementInfo[1] > largestFound[1]) {
              largestFound = scrollElementInfo;
            }
          }
        }
      });
    return largestFound;
  }
  const scrollInfo = _largestScrollableElement(element, depth);
  return scrollInfo && scrollInfo[0];
}

function guessScrollElement () {
  return document.scrollingElement || document.body || document.documentElement;
}

export function calculateCurrentScrollElement () {
  let scrollElement = largestScrollableElement(guessScrollElement());
  if (scrollElement === undefined) {
    scrollElement = guessScrollElement();
    if (SAKA_DEBUG) {
      console.log('No scrollElement candidate, defaulting to: ', scrollElement);
    }
  } else if (SAKA_DEBUG) {
    console.log('scrollElement changed to: ', scrollElement);
  }
  return scrollElement;
}

/** Scroll down page by a single step */
export function scrollDown (event) {
  scroll(currentScrollElement, event.repeat, scrollStep, 'scrollTop');
}

/** Scroll up page by a single step */
export function scrollUp (event) {
  scroll(currentScrollElement, event.repeat, -scrollStep, 'scrollTop');
}

/** Scroll left page by a single step */
export function scrollLeft (event) {
  scroll(currentScrollElement, event.repeat, -scrollStep, 'scrollLeft');
}

/** Scroll right page by a single step */
export function scrollRight (event) {
  scroll(currentScrollElement, event.repeat, scrollStep, 'scrollLeft');
}

// TODO: figure out why document.documentElement.clientHeight
// is buggy on hackernews, i wouldd use it over innerHeight otherwise
// ... I think it's related to quirks mode rendering since hackernew
// lacks a doctype
// https://github.com/akhodakivskiy/VimFx/blob/3a0a66d4250cd8f0f0dd0fbe4462b3419ba22d80/extension/lib/scrollable-elements.coffee#L34
/** Scroll down one page */
export function scrollPageDown () {
  scrollBy({
    top: innerHeight * 0.9,
    behavior
  });
}

/** Scroll up one page */
export function scrollPageUp () {
  scrollBy({
    top: -innerHeight * 0.9,
    behavior
  });
}

/** Scroll down half a page */
export function scrollHalfPageDown () {
  scrollBy({
    top: innerHeight / 2,
    behavior
  });
}

/** Scroll up half a page */
export function scrollHalfPageUp () {
  scrollBy({
    top: -innerHeight / 2,
    behavior
  });
}

/** Scroll to bottom of page */
export function scrollToBottom () {
  scrollTo({
    top: document.documentElement.scrollHeight,
    behavior
  });
}

/** Scroll to top page */
export function scrollToTop () {
  scrollTo({
    top: 0,
    behavior
  });
}

/** Scroll to far left of page */
export function scrollToLeft () {
  scrollTo({
    left: 0,
    behavior
  });
}

/** Scroll to far right of page */
export function scrollToRight () {
  scrollTo({
    left: document.documentElement.scrollWidth,
    behavior
  });
}