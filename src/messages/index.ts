import * as actions from './actions';
import * as content from './content';
import * as errors from './errors';
import * as misc from './misc';
import * as search from './search';
import * as subscription from './subscription';

// eslint-disable-next-line import/no-default-export
export default {
    ...actions,
    ...content,
    ...errors,
    ...misc,
    ...search,
    ...subscription,
};
