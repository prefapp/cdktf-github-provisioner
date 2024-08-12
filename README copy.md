[![Pr verify](https://github.com/prefapp/backstage-cdktf/actions/workflows/pr_verify.yaml/badge.svg)](https://github.com/prefapp/backstage-cdktf/actions/workflows/pr_verify.yaml)
# Backstage-CDKTF 
The CDKTF app for the Firestarer Backsage App.

## Description
The app has two fundamental parts:
 - Backstage for artifact pre-provisioning and artifact view.
 - CDKTF for artifact provisioning.

With the app is possible to:
   - Provision repositories
   - Create a repository with a template
   - Create a team
   - Add members to a team.

Is possible to create groups, add members to a group or repositories with a template. This creates a yaml file that uses the catalog templates to add label and executes a github action. 
The action follows some steps:

- This action is executed on pull request that has label "automerge".  
- The terraform status is saved in a S3 AWS for each component.
- In the CDKTF the yaml file is loaded as an artifact, is classified according to the kind and provisioned.
- After the provisioning the status field is modified.
- Returns a provisioned yaml file.
- Runs the automerge

In the provisioning workflow, it calculates every modified artifact and informs to CDKTF.
Launches a reconciliation process for each of the modified artifacts.
After the automerge  the new component with a status field is shown in the backstage page. 
The status can be Provisioned or ERROR. If there are errors, the status is with a link to the log of errors in github.

## Diagrams

![backstage-poc-1-Page-1 drawio](https://user-images.githubusercontent.com/55861837/205687510-68c164e3-5c1d-471e-8f2e-3d54719cd075.png)
![backstage-poc-1-worfkflows-github drawio](https://user-images.githubusercontent.com/55861837/205687533-b7376e16-cee0-4d45-868e-b2e43a6058fc.png)
![backstage-poc-1-repo-provisioning drawio](https://user-images.githubusercontent.com/55861837/205687544-798a26f5-0987-4415-b715-b4907c08736d.png)

## Development

- To start the development environment, you need to create a .env file with the following values.
- You'll need a Github PAT, if you don´t have one, create it [here](https://github.com/settings/tokens).

```
#.env

# To install the @prefapp/types npm package
NODE_AUTH_TOKEN=

# To execute the script that retrieves the features
GITHUB_TOKEN=
```

- Execute ```make init```
- Testing ```make unit-test```

## Use conventional commits 

- When you commit new changes, start the commit message by the following key words:
  - Increases PATCH ```git commit -m "fix: fixing a bug!"```
  - Increases MINOR ```git commit -m "feat: my chart can render an Ingress now!"```
  - Increases MAYOR ```git commit -m "feat!: my chart is completely new and has breaking changes!"```
