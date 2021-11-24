import * as actions from './actions';
import * as content from './content';
import * as errors from './errors';
import * as misc from './misc';
import * as subscription from './subscription';

export default {
    ...actions,
    ...content,
    ...errors,
    ...misc,
    ...subscription,
};
