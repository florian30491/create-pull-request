import { getInput } from "@actions/core";
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'

import {RequestParameters} from '@octokit/types'

type Inputs = RestEndpointMethodTypes["pulls"]["create"]["parameters"] & { reviewers: string[] };

export function getInputs(): Inputs {
  const head = getInput("head", { required: true });
  const title = getInput("title", { required: true });
  const base = getInput("base") || "master";
  const draft = getInput("draft") ? JSON.parse(getInput("draft")) : undefined;
  const body = getInput("body") || undefined;
  const reviewers = getInput("reviewers");

  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY is not set");
  }

  const [owner, repo] = githubRepository.split("/");

  return {
    owner,
    repo,

    title,
    head,
    base, // base branch
    body, // content of PR  (why string????????)
    draft,

    reviewers: reviewers
      ? reviewers.split(",").map(reviewer => reviewer.trim())
      : []
  };
}
