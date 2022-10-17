import { h } from 'vue';

const AtPanelTitle = (props, ctx) => {
  return 'default' in ctx.slots
    ? h(
        props.tag,
        Object.assign({}, ctx.attrs, {
          class: ['text-lg leading-6 font-medium text-gray-900 dark:text-white'].concat(
            'class' in ctx.attrs ? ctx.attrs.class : ''
          ),
        }),
        [ctx.slots.default()]
      )
    : null;
};

AtPanelTitle.props = {
  tag: { type: String, default: 'h2' },
};

export default AtPanelTitle;
