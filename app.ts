import { App, LogLevel } from '@slack/bolt';
import { Octokit } from "octokit";
import * as dotenv from 'dotenv';
import registerListeners from './listeners';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

/** Register Listeners */
registerListeners(app, octokit);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
