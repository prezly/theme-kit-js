import type { SdkError } from '../../types';

export function isSdkError(error: any): error is SdkError {
    return 'payload' in error;
}
