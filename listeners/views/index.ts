import { App } from '@slack/bolt';
import sampleViewCallback from './sample-view';
import sampleSubmittedCallback from './sample-submitted';
import { Octokit } from 'octokit';

const register = (app: App, octokit: Octokit) => {
  app.view('sample_view_id', sampleViewCallback);
  app.view('sample_submitted', (event) => sampleSubmittedCallback(event, octokit));
};

export default { register };
