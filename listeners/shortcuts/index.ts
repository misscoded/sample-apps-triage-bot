import { App } from '@slack/bolt';
import sampleShortcutCallback from './sample-shortcut';
import submitSampleCallback from './submit-sample';

const register = (app: App) => {
  app.shortcut('sample_shortcut_id', sampleShortcutCallback);
  app.shortcut('submit_sample', submitSampleCallback);
};

export default { register };
