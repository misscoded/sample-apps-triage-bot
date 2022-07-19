import { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from '@slack/bolt';

const sampleShortcutCallback = async ({ shortcut, ack, client }:
  AllMiddlewareArgs & SlackShortcutMiddlewareArgs) => {
  try {
    const { trigger_id } = shortcut;

    await ack();
    await client.views.open({
      trigger_id,
      view: {
        type: 'modal',
        callback_id: 'sample_submitted',
        title: {
          type: 'plain_text',
          text: 'Submit new sample',
        },
        blocks: [
          {
            type: "divider"
          },
          {
            type: "input",
            block_id: 'github_handle',
            element: {
              type: "plain_text_input",
              action_id: "github_handle_input",
              placeholder: {
                type: "plain_text",
                text: "@example",
                emoji: true
              },
            },
            label: {
              type: "plain_text",
              text: "GitHub handle",
              emoji: true
            },
          },
          {
            type: "input",
            block_id: "repository",
            element: {
              type: "plain_text_input",
              action_id: "repository_input"
            },
            label: {
              type: "plain_text",
              text: "Repository",
              emoji: true
            },
            hint: {
              type: "plain_text",
              text: "The repository must begin with the framework (ie, bolt-js-*, deno-*)",
              emoji: true,
            },
          },
          {
            type: "input",
            block_id: 'description',
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "description_input",
              placeholder: {
                type: "plain_text",
                text: "Briefly describe what functionality and features this sample demonstrates",
                emoji: true
              },
            },
            label: {
              type: "plain_text",
              text: "Description",
              emoji: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit',
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export default sampleShortcutCallback;
