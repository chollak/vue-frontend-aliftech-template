import { ref } from 'vue';
import { isDomElement } from '../utils/isDomElement';

/**
 * @typedef {Object} FloatingOverflowsReturn
 * @property {Number} left
 * @property {Number} right
 * @property {Number} top
 * @property {Number} bottom
 * */

/**
 * @typedef {Object} alignmentPositionReturn
 * @property {Number} x
 * @property {Number} y
 * */

/**
 * @typedef {Object} ClientElementRectReturn
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 * */

/**
 * @typedef {Object} useFloatingConfig
 * @property {String} placement
 * @property {String} alignment
 * @property {Boolean} autoFloating
 * @property {Array} offset
 * */

const PLACEMENTS = {
  left: 'left',
  right: 'right',
  bottom: 'bottom',
  top: 'top',
};
const OPPOSITE_PLACEMENTS = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom',
};
const ALIGNMENTS = {
  start: 'start',
  end: 'end',
};
const defaultConfig = {
  placement: 'bottom',
  alignment: null,
  autoFloating: true,
  offset: [0, 0],
};

/**
 * @param {HTMLElement} referenceEl - Reference dom-element
 * @param {HTMLElement} floatingEl - Floating dom-element
 * @param {Array} offset
 * @return {FloatingOverflowsReturn}
 */
function getFloatingOverflows(referenceEl, floatingEl, offset) {
  const referenceRect = referenceEl?.getBoundingClientRect();
  const floatingRect = floatingEl?.getBoundingClientRect();

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrolledContentHeight = scrollTop + window.innerHeight;

  const [offsetX, offsetY] = offset;
  return {
    left: referenceRect?.x - floatingRect?.width - offsetX,
    right: document.body.clientWidth - (referenceRect?.x + referenceRect?.width + floatingRect?.width + offsetX),
    top: referenceRect?.y - floatingRect?.height - offsetY,
    bottom:
      scrolledContentHeight - (scrollTop + referenceRect?.y + referenceRect?.height + floatingRect?.height + offsetY),
  };
}
/**
 * @param {HTMLElement} referenceEl - Reference dom-element
 * @param {HTMLElement} floatingEl - Floating dom-element
 * @param {String} placement
 * @param {String} alignment
 * @return {String}
 */
function getNormilizeAlignment(referenceEl, floatingEl, placement, alignment) {
  if ([PLACEMENTS.bottom, PLACEMENTS.top].includes(placement)) {
    let left = 0;
    let right = 0;

    const referenceRect = referenceEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();

    if (alignment === ALIGNMENTS.start) {
      right = referenceRect?.x + referenceRect?.width + Math.abs(referenceRect?.width - floatingRect?.width);
    } else if (alignment === ALIGNMENTS.end) {
      left = referenceRect?.x - Math.abs(referenceRect?.width - floatingRect?.width);
    } else {
      const edgeWidth = Math.abs(referenceRect?.width - floatingRect?.width) / 2;
      left = referenceRect?.x - edgeWidth;
      right = referenceRect?.x + referenceRect?.width + edgeWidth;
    }

    if (left < 0) {
      return ALIGNMENTS.start;
    } else if (right < 0) {
      return ALIGNMENTS.end;
    }
  }
}
/**
 * @param {DOMRect} referenceRect - Reference getBoundingClientRect
 * @param {DOMRect} floatingRect - Floating getBoundingClientRect
 * @param {Ref} alignmentRef
 * @param {Ref} placementRef
 * @return {alignmentPositionReturn}
 */
function getAlignmentPosition(referenceRect, floatingRect, alignmentRef, placementRef) {
  const result = {
    x: 0,
    y: 0,
  };
  const alignment = alignmentRef.value;
  const placement = placementRef.value;

  if ([PLACEMENTS.left, PLACEMENTS.right].includes(placement)) {
    switch (alignment) {
      case ALIGNMENTS.start:
        break;
      case ALIGNMENTS.end:
        result.y = referenceRect?.height - floatingRect?.height;
        break;
      default:
        result.y = referenceRect?.height / 2 - floatingRect?.height / 2;
        break;
    }
  } else if ([PLACEMENTS.top, PLACEMENTS.bottom].includes(placement)) {
    switch (alignment) {
      case ALIGNMENTS.start:
        break;
      case ALIGNMENTS.end:
        result.x = referenceRect?.width - floatingRect?.width;
        break;
      default:
        result.x = referenceRect?.width / 2 - floatingRect?.width / 2;
        break;
    }
  }

  return result;
}
/**
 * @param {HTMLElement} element - dom-element
 * @return {ClientElementRectReturn}
 */
function getClientElementRect(element) {
  const parentOffset = element?.offsetParent;
  const parentRect = parentOffset?.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    x: elementRect.left - parentRect.left,
    y: elementRect.top - parentRect.top,
    width: elementRect.width,
    height: elementRect.height,
  };
}

/**
 * @param {Ref} referenceRef - Reference ref to dom-element
 * @param {Ref} floatingRef - Floating ref to dom-element
 * @param {useFloatingConfig} config
 * @return {FloatingOverflowsReturn}
 */
export function useFloating(referenceRef, floatingRef, config = defaultConfig) {
  const { placement: initialPlacement, alignment: initialAlignment, autoFloating, offset } = config;
  const x = ref(null);
  const y = ref(null);
  const placement = ref(initialPlacement || null);
  const alignment = ref(initialAlignment || null);

  /**
   * @return {undefined}
   */
  const updatePosition = () => {
    const referenceEl = referenceRef.value?.$el;
    const floatingEl = floatingRef.value?.$el;

    if (!isDomElement(referenceEl) || !isDomElement(floatingEl)) return;

    const referenceRect = getClientElementRect(referenceEl);
    const floatingRect = getClientElementRect(floatingEl);
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    const overflows = getFloatingOverflows(referenceEl, floatingEl, offset);

    placement.value =
      overflows[config.placement] < 0 && overflows[OPPOSITE_PLACEMENTS[config.placement]] >= 0
        ? OPPOSITE_PLACEMENTS[config.placement]
        : config.placement;

    alignment.value =
      getNormilizeAlignment(referenceEl, floatingEl, initialPlacement, initialAlignment) || initialAlignment;

    const alignmentPosition = getAlignmentPosition(referenceRect, floatingRect, alignment, placement);

    const [offsetX, offsetY] = offset;
    switch (placement.value) {
      case PLACEMENTS.left:
        x.value = referenceRect?.x - floatingRect?.width - offsetX;
        y.value = scrollTop + referenceRect?.y + alignmentPosition.y + offsetY;
        break;
      case PLACEMENTS.right:
        x.value = referenceRect?.x + referenceRect?.width + offsetX;
        y.value = scrollTop + referenceRect?.y + alignmentPosition.y + offsetY;
        break;
      case PLACEMENTS.top:
        x.value = referenceRect?.x + alignmentPosition.x - offsetX;
        y.value = referenceRect?.y - floatingRect?.height - offsetY;
        break;
      case PLACEMENTS.bottom:
        x.value = referenceRect?.x + alignmentPosition.x + offsetX;
        y.value = referenceRect?.y + referenceRect?.height + offsetY;
        break;
    }
  };

  if (autoFloating) {
    window.addEventListener('scroll', updatePosition, {
      passive: true,
    });
    window.addEventListener('resize', updatePosition);
  }

  return {
    x,
    y,
    updatePosition,
    destroyAutoFloating: () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    },
  };
}
