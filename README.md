## Success Notification

[Main Notification](docs/images/main.png)

[Post Notification](docs/images/post.png)

# MS Notify

MS Notify is a GitHub Action that sends notifications to Microsoft Teams.

## Configuration

### Required Inputs

| Input          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `github-token` | GitHub token for API authentication (`secrets.GITHUB_TOKEN`) |
| `webhook-uri`  | Microsoft Teams webhook URL                                  |
| `debug`        | Enable debug logging                                         |

### Message Options

| Input          | Description                                        |
| -------------- | -------------------------------------------------- |
| `main-message` | Main message to be displayed in Teams notification |
| `post-message` | Post message to be displayed in Teams notification |

### Display Options

| Input                  | Description                          | Default |
| ---------------------- | ------------------------------------ | ------- |
| `show-author`          | Display commit author                | `true`  |
| `show-event`           | Display trigger event                | `true`  |
| `show-status`          | Display workflow status              | `true`  |
| `show-branch`          | Display branch information           | `true`  |
| `show-job`             | Display job information              | `true`  |
| `show-start-time`      | Display start time                   | `true`  |
| `show-end-time`        | Display end time                     | `true`  |
| `show-commit-message`  | Display commit message               | `true`  |
| `uppercase-repo-name`  | Convert repository name to uppercase | `false` |

### Action Buttons

| Input                   | Description               | Default |
| ----------------------- | ------------------------- | ------- |
| `enable-view-workflow`  | Add workflow view button  | `false` |
| `enable-review-changes` | Add changes review button | `false` |
| `enable-view-job`       | Add job view button       | `false` |

### Time & Date Settings

| Input        | Description                                     | Default        |
| ------------ | ----------------------------------------------- | -------------- |
| `timezone`   | IANA timezone identifier (e.g., 'Asia/Kolkata') | `Asia/Kolkata` |
| `date-style` | Date format (`full`, `long`, `medium`, `short`) | `medium`       |
| `time-style` | Time format (`full`, `long`, `medium`, `short`) | `short`        |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.