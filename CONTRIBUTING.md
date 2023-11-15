# Contributing

## Commit Message Format

All commit messages on `main` should follow the conventional commits format and must contain a ticket ID. For example:

```
 feat: ABC-123 Allowed provided config object to extend other configs
  ^      ^
(type)  (Ticket ID)
```

The supported types are:

- Patch version update:
  - **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  - **chore**: A change that doesn't fall under any other types that affect the patch version such as removing an unused file
  - **ci**: Changes to the CI configuration files and scripts
  - **docs**: Documentation only changes
  - **fix**: A bug fix
  - **perf**: A code change that improves performance
  - **refactor**: A code change that neither fixes a bug nor adds a feature
  - **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - **test**: Adding missing tests or correcting existing tests
- Minor version update:
  - **feat**: A new feature
- Major version update:
  - **breaking** or **breaking change**: A breaking change
