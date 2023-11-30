# Teampulse
## API Documentation

- **POST** requests pass parameters in JSON format in **Body**, mostly data from forms
- **GET** requests pass parameters that are part of the URL (route)
                                        
| URI              | METHOD | INPUT                                                          | OUTPUT                                                          |
| ---------------- | ------ | -------------------------------------------------------------- | --------------------------------------------------------------- |
| workspace/create | POST   | `name`, `description`, `owner`, `members[] {id}`               | `id`, `name`, `description`, `owner`, `members[] {id}`          |
| workspace/get    | GET    | `id`                                                           | `id`, `name`, `description`, `owner`, `members[] {id}`          |
| workspace/update | POST   | `id`, `name`, `description`, `owner`, `members[] {id}`         | `id`, `name`, `description`, `owner`, `members[] {id}`          |
| workspace/delete | POST   | `id`                                                           | `id`, `name`, `description`, `owner`, `members[] {id}`          |
| workspace/view   | GET    | -                                                              | `workspaces[] { id, name, description, owner, members[] {id} }` |
|                  |        |                                                                |                                                                 |
| task/create      | POST   | `name`, `description`, `solver`, `deadline`, `status`          | `id`, `name`, `description`, `solver`, `deadline`, `status`     |
| task/get         | GET    | `id`                                                           | `id`, `name`, `description`, `solver`, `deadline`, `status`     |
| task/update      | POST   | `id`, `name`, `description`, `solver`, `deadline`, `status`    | `id`, `name`, `description`, `solver`, `deadline`, `status`     |
| task/delete      | POST   | `id`                                                           | `id`, `name`                                                    |
| task/view        | GET    | -                                                              | `tasks[] { id, name, description, solver, deadline, status}`    |
|                  |        |                                                                |                                                                 |
| user/create      | POST   | `username`, `firstname`, `lastname`, `email`, `password`       | `id`, `username`, `firstname`, `lastname`, `email`, `password`  |
| user/get         | GET    | `id`                                                           | `id`, `username`, `firstname`, `lastname`, `email`, `password`  |
| user/update      | POST   | `id`, `username`, `firstname`, `lastname`, `email`, `password` | `id`, `username`, `firstname`, `lastname`, `email`, `password`  |
| user/delete      | POST   | `id`                                                           | `id`, `username`                                                |
| user/view        | GET    | -                                                              | `users[] { id, username, firstname, lastname, email }`          |
