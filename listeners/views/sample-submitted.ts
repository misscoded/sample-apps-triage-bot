import { AllMiddlewareArgs, SlackViewMiddlewareArgs, View, ViewOutput } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Octokit } from 'octokit';

const sampleSubmittedCallback = async (event: AllMiddlewareArgs & SlackViewMiddlewareArgs, octokit: Octokit) => {
  const { ack, view, body, client } = event;
  await ack({ response_action: "update", view: loadingView() });

  try {
    const { github_handle, repository, description } = view.state.values;
    const githubHandle = github_handle.github_handle_input.value;
    const repoName = repository.repository_input.value;
    const sampleDesc = description.description_input.value;

    if (!githubHandle || !repoName || !sampleDesc) return;

    // TODO ?? should this be moved to actions, on debounce, real-time feedback?
    const inputsValid = validateInputs(githubHandle, repoName, sampleDesc);
    if (!inputsValid) updateModalForm(client, view);

    // TODO :: validate inputs
    // -- if handle doesn't start with @, add it
    // -- if handle doesn't exist, show error message
    // -- if repo doesn't start with bolt-js/deno/bolt-py, show error

    // *** create repo in slack-samples

    // on successful submission --
    // # OPTION 1: CREATE REPOSITORY IN ORG
    // octokit.rest.repos.createInOrg({
    //   org: 'slack-samples',
    //   name: repoName,
    //   private: true,
    //   visibility: 'internal',
    // });

    // # OPTION 2: CREATE REPOSITORY USING TEMPLATE
    // octokit.rest.repos.createUsingTemplate({
    //   template_owner: 'misscoded', // would like to change this to a group/generic entity
    //   template_repo: 'slack-samples/bolt-js-starter-template',
    //   owner: 'misscoded', // would like to change this to a group/generic entity,
    //   name: repoName,
    //   private: true,
    // });

    // *** create development branch in repository
    // ?? need sha from `object` key but can't access it..
    // octokit.rest.git.getRef({
    //   owner: 'misscoded', // switch this out for generic/group entity
    //   repo: `slack-samples/${repoName}`,
    //   ref: 'heads'
    // });

    // octokit.rest.git.createRef({
    //   owner: 'misscoded', // switch this out for generic/group entity
    //   repo: `slack-samples/${repoName}`,
    //   ref: `refs/heads/initial-submission`,
    //   sha // TODO :: not sure about this one?
    // })

    // *** add github handle as collaborator to repository
    // octokit.rest.repos.addCollaborator({
    //   owner: 'misscoded', // switch this out for generic/group entity
    //   repo: `slack-samples/${repoName}`,
    //   username: githubHandle,
    //   permission: "triage", // comment indicates role acceptable, but type doesn't seem to support it
    // })

    // TODO :: DM submitting user documentation and next steps
    // client.chat.postMessage({
    //   channel: body.user.id,
    //   blocks: [
    //     // TODO :: create response with detailed information/instructions for user
    //   ],
    // });

    // TODO :: change view to confirm setup and instruct to view DM
    updateModalSuccess(client, view)

    // client.chat.postMessage({
    //   channel: sampleConvoValue || body.user.id,
    //   text: `<@${body.user.id}> submitted the following :sparkles: hopes and dreams :sparkles:: \n\n ${sampleInputValue}`,
    // });
  } catch (error) {
    // on unsuccessful submission --
    // TODO :: if error occurs during creation, change view to indicate
    // an error occurred, it's been reported, and that we'll get back to them
    updateModalError(client, view)
    console.error(error);
  }
};

/**
 * loadingView updates the modal view to feature a loading animation while
 * the submission is validated and the new repository and associated
 * configuration is set up.
 */
function loadingView(): View {
  return {
    type: 'modal',
    callback_id: 'sample_submitted',
    title: {
      type: 'plain_text',
      text: 'Creating foundation..',
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Creating foundation...',
        },
      },
    ],
  };
}

function validateInputs(githubHandle: string, repoName: string, sampleDesc: string): boolean {
  return true;
}


function updateModalForm(client: WebClient, view: ViewOutput): void {

}

function updateModalSuccess(client: WebClient, view: ViewOutput): void {
  client.views.update({
    view_id: view.id,
    view: {
      type: 'modal',
      callback_id: 'sample_submitted',
      title: {
        type: 'plain_text',
        text: 'Submission successful',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Sample submitted! :tada:',
          },
        },
      ],
    },
  });
}

function updateModalError(client: WebClient, view: ViewOutput): void {
  client.views.update({
    view_id: view.id,
    view: {
      type: 'modal',
      callback_id: 'sample_submitted',
      title: {
        type: 'plain_text',
        text: 'Submission error',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'An error occurred during the creation process',
          },
        },
      ],
    },
  });
}

export default sampleSubmittedCallback;
