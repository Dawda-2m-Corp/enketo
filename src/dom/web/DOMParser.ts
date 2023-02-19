/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type { DOM } from '../abstract';

/** @package */
export const DOMParser = globalThis.DOMParser satisfies new () => DOM.DOMParser;
