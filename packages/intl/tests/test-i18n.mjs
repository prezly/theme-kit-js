import assert from 'node:assert';

import messages from '@prezly/theme-kit-intl/i18n/nl.json' with { type: 'json' };

assert(messages['actions.backToHomepage'][0].value === 'Terug naar de startpagina');
