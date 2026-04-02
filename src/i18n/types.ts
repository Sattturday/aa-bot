import { messageCatalog } from './messages';

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepKeys<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]:
        T[K] extends Primitive
          ? K
          : `${K}.${DeepKeys<T[K]>}`;
    }[keyof T & string];

export type CatalogMessageKey = DeepKeys<typeof messageCatalog>;
export type MessageKey = CatalogMessageKey | `group_${string}`;
