# GitHub repository configurations

## Special branches
* `mit-main` is our default branch and contains our production code.
  * Pushing directly to `mit-main` is disabled by a branch protection rule.

# Development workflows

The `Run Tests` GitHub Actions workflow runs the Angular test suite in headless Chrome whenever commits are pushed. Run the same suite locally with `npm test -- --no-watch --browsers=ChromeHeadlessNoSandbox`.

## Developing and testing locally


Use the NDE development environment for local development.

1. In Alma, go to Configuration Menu > Discovery > Add-on Configuration and deactivate the add-on for the `NDE_DEV` view (or other non-production view you plan to test against) so it does not interfere with local testing.
2. If needed, set up the NDE development environment by following the instructions in README.md.
3. Create a new branch off of `mit-main` and make your changes.
4. Test your changes using the development proxy server.
    1. Run `npm run build`.
    2. Start the development server with the proxy by running `npm run start:proxy`.
    3. Test the add-on functionality as necessary.
5. Restore the add-on's configuration in Alma when local testing is complete.

* Note: Do not set `ADDON_NAME` in `build-settings.env` when developing and testing locally. The build changes the exposed module from `./custom-module` to `./<ADDON_NAME>`, so Primo cannot load it as the local customization. The build and publish GitHub workflows (see below) will set the add-on name.

## Testing the built add-on by publishing to the dev CDN
The local dev environment does not exercise the production build or the way Primo loads the add-on from the CDN. To test the built add-on, publish it to the dev CDN using the `Dev Build and Publish` GitHub Action.
1. Push a branch with your changes to GitHub.
2. Publish the branch to the dev CDN in one of two ways:
    - Open a PR targeting `mit-main`. The workflow runs automatically on PRs, except those that only change files under `.github/`.
    - Or run the `Dev Build and Publish` workflow manually (Actions tab > Dev Build and Publish > Run workflow) and select the branch to test.
3. The workflow builds the add-on and syncs it to the dev CDN bucket. See the action's summary for the dev CDN URL for the add-on.
4. In Alma, go to Configuration Menu > Discovery > Add-on Configuration and create an add-on using the dev CDN URL for the add-on. Activate it for the `NDE_DEV` view and supply an add-on configuration file. This requires a user with write access to Discovery Configuration in Alma.
5. Confirm that the add-on is working as expected in the `NDE_DEV` view.

## Deploying to stage
Merging a PR into `mit-main` automatically runs the `Stage Build and Publish` workflow, which builds the add-on and publishes it to the stage CDN. It can also be run manually from the Actions tab. The stage CDN URL for the add-on can be found in the action's summary.

Confirm the workflow succeeds, then validate the add-on in the Primo view that is configured with the stage CDN add-on URL. 

## Deploying to production
Deploying to production makes changes available to all users.
1. Make sure your changes have been through a PR, been approved, and been merged into `mit-main`, and that the stage build succeeded and was validated.
2. Tag and publish a new release on the `mit-main` branch in GitHub.
3. Publishing the release automatically runs the `Prod Build and Publish` workflow, which builds the add-on and publishes it to the production CDN at `https://cdn.libraries.mit.edu/nde/mit-tacos/`.
4. Confirm the workflow succeeds and verify the add-on in production Primo.

## Syncing with the upstream forked repository
This repository is forked from https://github.com/ExLibrisGroup/customModule

If you're using an AI coding agent, invoke the [sync-upstream skill](./.agents/skills/sync-upstream/SKILL.md) to run steps 1-7 for you; you then open the PR and follow the remaining steps yourself. Otherwise, take the following steps manually to sync our repository with changes from this upstream repository.

1. (Optional, one-time setup) If you don't already have an `upstream` remote configured, check with `git remote -v`. If `upstream` is missing, add it: `git remote add upstream https://github.com/ExLibrisGroup/customModule.git`.
2. Fetch the latest changes from the upstream repository: `git fetch upstream`.
3. Update your local `mit-main` branch: `git checkout mit-main && git pull origin mit-main`.
4. Create a new branch from `mit-main` for the sync, e.g. `git checkout -b sync-upstream-YYYY-MM-DD`. If you already synced today, or that branch name exists locally or on origin, add a suffix such as `-2`.
5. Merge the upstream changes directly into your new branch: `git merge upstream/main`. Resolve any merge conflicts if they occur.
6. Test the changes locally by running the development server with proxy `npm run start:proxy`, following the instructions in README.md, and confirm nothing is broken.
7. Push your branch to GitHub: `git push origin <your-sync-branch>`.
8. Open a PR on GitHub to merge your branch into `mit-main` and request a review.
9. Once your PR is reviewed and approved, follow the steps above for testing and deploying to production.