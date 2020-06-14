import { ServiceHelper } from 'services/core';
import { TPlatform } from '../platforms';

const errorTypes = {
  TWITCH_REQUEST_FAILED: {
    message: 'The request to Twitch API has been failed',
  },
  YOUTUBE_REQUEST_FAILED: {
    message: 'The request to Youtube API has been failed',
  },
  PREPOPULATE_FAILED: {
    message: 'Failed to fetch channel info',
  },
  CHANNEL_UPDATE_FAILED: {
    message: 'Failed to update channel info',
  },
  FACEBOOK_HAS_NO_PAGES: {
    message: 'You must create a Facebook gaming page to go live with Facebook',
  },
  RESTREAM_DISABLED: {
    message:
      'The Restream server is temporarily down and streaming to multiple platforms is unavailable',
  },
  RESTREAM_SETUP_FAILED: {
    message: 'Failed to setup the Restream',
  },
  YOUTUBE_PUBLISH_FAILED: {
    message: 'Failed to publish the Youtube broadcast',
  },
};
export type TStreamErrorType = keyof typeof errorTypes;
const newCallProtector = Symbol('singleton');

export interface IStreamError {
  message: string;
  platform?: TPlatform;
  type: TStreamErrorType;
  details?: string;
}

export class StreamError extends Error {
  public platform: TPlatform;
  public type: TStreamErrorType;
  public details: string;
  /**
   * returns serializable representation of the error
   */
  public getModel = () => {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      platform: this.platform,
    };
  };

  constructor(
    message: string,
    type: TStreamErrorType,
    details: string,
    platform: TPlatform,
    protector: typeof newCallProtector,
  ) {
    super(message);
    this.message = message;
    this.type = type;
    this.details = details;
    this.platform = platform;
    // don't allow to call 'new' outside this file
    if (protector !== newCallProtector) {
      throw new Error('Use createStreamError() instead "new StreamError()"');
    }
  }

  isDestroyed() {
    return false;
  }
}

/**
 * create StreamError object extended from Error (has callstack)
 */
export function createStreamError(
  type: TStreamErrorType,
  details?: string,
  platform?: TPlatform,
): StreamError {
  return new StreamError(errorTypes[type].message, type, details, platform, newCallProtector);
}

/**
 * a shortcut for "throw new StreamError()"
 */
export function throwStreamError(
  type: TStreamErrorType,
  details?: string,
  platform?: TPlatform,
): never {
  throw createStreamError(type, details, platform);
}
