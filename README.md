# actions-comment-pull-request

GitHub action to comment pull request with customizable message 

## Usage

### Workflow file
Create a workflow (eg: `.github/workflows/comment.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) with this content:

```yml
name: PR comment
on: pull_request

jobs:
  comment-on-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: pierre-ernst/actions-comment-pull-request@v1.0
        with: 
          ghToken: ${{ secrets.GITHUB_TOKEN }}
          message: "Looks like you have updated a Java file. Make sure to follow our secure coding guide."
          file-match: "^((?:[^/]*/)*)([^\\.]+\\.java)$"
```

### Parameters

| Name       | Description                                                | Mandatory |
| ---------- | ---------------------------------------------------------- |:---------:|
| ghToken    | GitHub Personal Access Token                               | Y         |
| message    | Message to add to the PR (supports Markdown)               | Y         |
| file-match | Regex to indicate when a modified file should be commented (by default, *all* files are matched) | N         |

#### Message variables

In addition to [contexts and expression syntax](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions), the message value can contain `$name` values that will be replaced by dynamically generated content.
e.g. `message: "file $file has been changed"`

The following variables are supported:

| Name   | Value                            |
| ------ |--------------------------------- |
| $dir   | Folder name of the modified file |
| $file  | Full path of the modified file   |
| $owner | Owner of the GithHub repo        | 
| $repo  | Name of the GithHub repo         | 

