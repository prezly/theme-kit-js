import type { SearchSettings } from '@prezly/theme-kit-core/server';
import { useMemo } from 'react';

import { getSearchClient } from '../utils';

export function useSearchClient(settings: SearchSettings) {
    return useMemo(() => getSearchClient(settings), [settings]);
}
