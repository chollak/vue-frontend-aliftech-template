import { defineComponent, h, reactive, ref } from 'vue';

const getTop = tooltipHeight => {
  return (0 - tooltipHeight - 8) / 16;
};

const getBottom = wrapperHeight => {
  return (wrapperHeight + 8) / 16;
};

export default defineComponent({
  name: 'AtTooltip',
  props: {
    body: {
      type: String,
      default: '',
    },
    trigger: {
      type: String,
      default: 'hover',
      validator: trigger => {
        return trigger === 'hover' || trigger === 'click' || trigger === 'focus';
      },
    },
    position: {
      type: String,
      default: 'bottom',
      validator: position => {
        return position === 'top' || position === 'bottom';
      },
    },
  },
  setup(props) {
    const show = ref(false);
    const display = ref(false);

    const tooltipWrapper = ref(null);
    const tooltipBody = ref(null);
    const timeoutId = ref(0);

    let tooltipPosition = reactive({
      left: null,
      top: null,
    });

    /**
     * Check if Object is and html element
     * @param {Object} el
     */
    const isHtmlElement = el => {
      try {
        return (
          el && el instanceof Element && 'clientWidth' in el && 'clientHeight' in el && 'getBoundingClientRect' in el
        );
      } catch (e) {
        return (
          el && typeof el === 'object' && 'clientWidth' in el && 'clientHeight' in el && 'getBoundingClientRect' in el
        );
      }
    };

    /**
     * Метод получения позици выпадающего списка
     * @return {VoidFunction}
     * */
    const getPosition = () => {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value);
      }
      timeoutId.value = setTimeout(() => {
        if (isHtmlElement(tooltipWrapper.value) && isHtmlElement(tooltipBody.value)) {
          const { clientHeight: wrapperHeight, clientWidth: wrapperWidth } = tooltipWrapper.value;
          const { scrollWidth: tooltipWidth, scrollHeight: tooltipHeight } = tooltipBody.value;

          tooltipPosition.top = props.position === 'top' ? getTop(tooltipHeight) : getBottom(wrapperHeight);
          tooltipPosition.left = 0;

          if (
            tooltipPosition.top * 16 + tooltipHeight + tooltipWrapper.value.getBoundingClientRect().top >
            window.innerHeight
          ) {
            tooltipPosition.top = getTop(tooltipHeight);
          }

          if (
            tooltipPosition.left * 16 + tooltipWidth >
            window.innerWidth - tooltipWrapper.value.getBoundingClientRect().x
          ) {
            tooltipPosition.left = (0 - tooltipWidth + wrapperWidth) / 16;
          }

          show.value = true;
        }
      }, 100);
    };

    /**
     * Toggle tooltip visibility
     * @param value
     */
    const toggle = value => {
      display.value = value;
      show.value = false;

      if (value) {
        getPosition();
      }
    };

    const triggerEvents = {
      'click': {
        onClick: () => toggle(!show.value),
      },
      'hover': {
        onMouseenter: () => toggle(true),
        onMouseleave: () => toggle(false),
      },
      'focus': {
        onFocus: () => toggle(true),
        onBlur: () => toggle(false),
      },
    };

    return {
      triggerEvents,
      show,
      display,
      tooltipWrapper,
      tooltipBody,
      tooltipPosition,
      getPosition,
      toggle,
    };
  },
  render() {
    return h('div', { class: 'relative', ref: 'tooltipWrapper', ...this.triggerEvents[this.trigger], tabindex: '-1' }, [
      h('div', { class: [] }, ['default' in this.$slots ? this.$slots.default() : null]),
      h(
        'div',
        {
          class: [
            'bg-gray-900',
            'dark:bg-gray-600',
            'text-white',
            'bg-opacity-80',
            'rounded-md',
            'px-6 py-4',
            'absolute',
            'z-50',
            'transform',
            'transition-opacity',
            'transition-transform',
            'duration-75',
            'ease-out',
            'max-w-xs',
          ],
          style: {
            width: 'max-content',
            left: this.tooltipPosition.left + 'rem',
            top: this.tooltipPosition.top + 'rem',
            display: this.display ? 'block' : 'none',
            opacity: this.show ? 1 : 0,
            overflow: this.show ? 'visible' : 'hidden',
            transform: this.show ? 'scale(1)' : 'scale(0.95)',
          },
          ref: 'tooltipBody',
        },
        ['body' in this.$slots ? this.$slots.body() : this.body]
      ),
    ]);
  },
});
