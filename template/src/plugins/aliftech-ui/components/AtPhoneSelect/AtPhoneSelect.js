import { h, ref, defineComponent } from 'vue';

import { generatorId } from '../../utils';
import InputElements from '../../mixins/props/InputElements';

import AtInput from '../AtInput/AtInput';
import AtInputAddOnSelect from '../AtInputAddOnSelect/AtInputAddOnSelect';

export default defineComponent({
  name: 'AtPhoneSelect',
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId('at-phone-select-') },
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: 'Номер телефона' },
    placeholder: { type: String, default: '99 999 99 99' },
    mask: { type: String, default: '## ### ## ##' },
  },
  setup(props) {
    let country = ref('998');
    let phone = ref(props.modelValue);
    if (String(props.modelValue).length === 12) {
      phone.value = props.modelValue.slice(3);
      country.value = props.modelValue.slice(0, 3);
    }
    const prefix = [
      { value: '998', title: '🇺🇿 (+998)' },
      { value: '992', title: '🇹🇯 (+992)' },
    ];

    return { country, phone, prefix };
  },
  render() {
    return h(
      AtInput,
      {
        id: this.id,
        addOnBeforeSelect: true,
        modelValue: this.phone,
        mask: this.mask,
        placeholder: this.placeholder,
        label: this.label,
        error: this.error,
        success: this.success,
        disabled: this.disabled,
        'onUpdate:modelValue': value => {
          this.phone = value;
          this.$emit('update:modelValue', this.country + value);
          this.$emit('onChange', value);
        },
      },
      {
        addOnBefore: () =>
          h(AtInputAddOnSelect, {
            items: this.prefix,
            modelValue: this.country,
            beforeInput: true,
            'onUpdate:modelValue': value => {
              this.$emit('update:modelValue', value + this.phone);
              this.country = value;
            },
          }),
      }
    );
  },
});
