import { ButtonKey } from '../data/buttonKeys';
import { messageCatalog } from './messages';
import { CatalogMessageKey, MessageKey } from './types';

function isCatalogMessageKey(value: string): value is CatalogMessageKey {
  return Object.prototype.hasOwnProperty.call(messageCatalog, value);
}

function isDynamicGroupKey(value: string): value is `group_${string}` {
  return value.startsWith('group_');
}

export function isMessageKey(value: string): value is MessageKey {
  return isDynamicGroupKey(value) || isCatalogMessageKey(value);
}

export function mapButtonKeyToMessageKey(key: ButtonKey): MessageKey | null {
  if (isDynamicGroupKey(key)) {
    return key;
  }

  switch (key) {
    case 'newbie_about_aa':
    case 'relative_about_aa':
      return 'about_aa';
    case 'newbie_literature':
    case 'participant_literature':
      return 'literature';
    case 'newbie_group_schedule':
    case 'participant_group_schedule':
      return 'group_schedule';
  }

  if (isCatalogMessageKey(key)) {
    return key;
  }

  return null;
}
