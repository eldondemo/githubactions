const core = require('@actions/core');

try {
  // Read inputs defined in action.yml
  const message = core.getInput('message', { required: true });
  const uppercase = core.getInput('uppercase') === 'true';

  // Format the result
  let result = `🎉 ${message}`;
  if (uppercase) {
    result = result.toUpperCase();
  }

  // Set output so the caller workflow can use it
  core.setOutput('result', result);

  // Log annotations — these show up in the Actions UI
  core.notice(`Greeting generated: ${result}`);
  core.info(`Input message: "${message}"`);
  core.info(`Uppercase: ${uppercase}`);

  // Write to step summary
  core.summary
    .addHeading('Demo JS Action', 3)
    .addTable([
      [{ data: 'Input', header: true }, { data: 'Value', header: true }],
      ['message', message],
      ['uppercase', String(uppercase)],
      ['result', result]
    ])
    .write();

} catch (error) {
  core.setFailed(`Action failed: ${error.message}`);
}
