const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');

async function createSingleComment(octokit, message, owner, repo, issue_number, filePath) {

    const body = message.replace("$file", filePath).replace("$dir", path.dirname(filePath))
        .replace("$owner", owner).replace("$repo", repo);

    const resp = await octokit.issues.createComment({
        owner,
        repo,
        issue_number,
        body
    });

    console.log(resp.data.html_url);
}

async function createComments() {

    const owner = github.context.payload.repository.owner.login;
    const repo = github.context.payload.repository.name;
    const pull_number = github.context.payload.pull_request.number;

    const fileNameRegex = core.getInput('file-match');
    const message = core.getInput('message');
    const ghToken = core.getInput('ghToken');

    const octokit = new github.GitHub(ghToken);
    const files = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number
    });
    files.data.forEach(file => {
        if (file.filename.match(fileNameRegex)) {
            createSingleComment(octokit, message, owner, repo, pull_number, file.filename);
        }
    });
}

try {

    if (github.context.eventName == "pull_request") {
        createComments();
    } else {
        console.log(`Unexpected event name: ${github.context.eventName}`);
    }

} catch (error) {
    core.setFailed(error.message);
}
