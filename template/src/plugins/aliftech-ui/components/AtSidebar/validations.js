import { hasOwnProperty, checkType } from '../../utils';

export const validateItem = item =>
  !item.to
    ? hasOwnProperty(item, 'routes') &&
      item.routes.length &&
      hasOwnProperty(item, 'title') &&
      typeof item.title === 'string'
    : hasOwnProperty(item, 'to') &&
      typeof item.to === 'object' &&
      hasOwnProperty(item, 'title') &&
      typeof item.title === 'string';

export const validateDropdownItem = userDropdownItems => {
  if (!checkType(userDropdownItems, 'object')) {
    return false;
  }
  if (!(hasOwnProperty(userDropdownItems, 'title') && checkType(userDropdownItems.title, 'string'))) {
    return false;
  }
  if (!(hasOwnProperty(userDropdownItems, 'onClick') && checkType(userDropdownItems.onClick, 'function'))) {
    return false;
  }
  if (hasOwnProperty(userDropdownItems, 'icon')) {
    if (!checkType(userDropdownItems.icon, 'object') && !checkType(userDropdownItems.icon, 'string')) {
      return false;
    }
    if (checkType(userDropdownItems.icon, 'object')) {
      if (!(hasOwnProperty(userDropdownItems.icon, 'name') && checkType(userDropdownItems.icon.name, 'string'))) {
        return false;
      }
      if (!(hasOwnProperty(userDropdownItems.icon, 'type') && checkType(userDropdownItems.icon.type, 'string'))) {
        return false;
      }
    }
  }
  return true;
};
