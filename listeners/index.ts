import { App } from '@slack/bolt';
import { Octokit } from 'octokit';
import actions from './actions';
import commands from './commands';
import events from './events';
import messages from './messages';
import shortcuts from './shortcuts';
import views from './views';

const registerListeners = (app: App, octokit: Octokit) => {
  actions.register(app);
  commands.register(app);
  events.register(app);
  messages.register(app);
  shortcuts.register(app);
  views.register(app, octokit);
};

export default registerListeners;
