import { setFailed, setOutput, getInput } from "@actions/core";
import {getOctokit} from '@actions/github';
import { getInputs } from "./getInputs";

async function run(): Promise<void> {
  try {

    const { reviewers, ...pullParams } = getInputs();

    const octokit = getOctokit(getInput('github_token', {required: true}));
    const pullRequest = await octokit.rest.pulls.create(pullParams);

    const pullNumber = pullRequest.data.number;

    if (reviewers.length > 0) {
      await octokit.rest.pulls.requestReviewers({
        owner: pullParams.owner,
        repo: pullParams.repo,
        pull_number: pullNumber,
        reviewers: reviewers,
      });
    }

    setOutput("number", pullNumber.toString());
  } catch (error) {
    setFailed(error.message);
  }
}

run();
