# Teampulse

## API Documentation

- **POST** requests pass parameters in JSON format in **Body**, mostly data from forms
- **GET** requests pass parameters that are part of the URL (route)

| URI                     | METHOD | INPUT                                                                                    | OUTPUT                                                                                |
| ----------------------- | ------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| company/create          | POST   | `session`, `name`, `description`, `owner_id`                                             | `awid`, `name`, `description`, `owner_id`, `users[] {id, roles[]}`                    |
| company/get             | GET    | `session`, `awid`                                                                        | `awid`, `name`, `description`, `owner_id`, `users[] {id, roles[]}`                    |
| company/update          | POST   | `session`, `awid`, `name`, `description`, `owner_id`                                     | `awid`, `name`, `description`, `owner_id`, `users[] {id, roles[]}`                    |
| company/view            | GET    | `session`                                                                                | `companies[] {awid, name, description, owner_id, users[] {id, roles[]}}`              |
| company/add-user        | GET    | `session`, `awid`, `user_id`, `roles[]`                                                  | `awid`, `name`, `description`, `owner_id`, `users[] {id, roles[]}`                    |
| company/delete-user     | GET    | `session`, `awid`, `user_id`                                                             | `awid`, `name`, `description`, `owner_id`, `users[] {id, roles[]}`                    |
|                         |        |                                                                                          |                                                                                       |
| workspace/create        | POST   | `session`, `awid`, `name`, `description`, `owner_id`                                     | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`                     |
| workspace/get           | GET    | `session`, `id`                                                                          | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`                     |
| workspace/update        | POST   | `session`, `id`, `name`, `description`, `owner_id`                                       | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`                     |
| workspace/delete        | POST   | `session`, `id`                                                                          | `deleted`                                                                             |
| workspace/view          | GET    | `session`                                                                                | `workspaces[] {id, awid, name, description, owner_id, members[] {id}}`                |
| workspace/add-member    | GET    | `session`, `id`, `user_id`                                                               | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`                     |
| workspace/delete-member | GET    | `session`, `id`, `user_id`                                                               | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`                     |
|                         |        |                                                                                          |                                                                                       |
| task/create             | POST   | `session`, `worspace_id`, `name`, `description`, `solver_id`, `deadline`, `status`       | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status`         |
| task/get                | GET    | `session`, `id`                                                                          | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status`         |
| task/update             | POST   | `session`, `id`, `worspace_id`, `name`, `description`, `solver_id`, `deadline`, `status` | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status`         |
| task/delete             | POST   | `session`, `id`                                                                          | `deleted`                                                                             |
| task/view               | GET    | `session`                                                                                | `tasks[] {worspace_id, id, name, description, solver_id, deadline, status}`           |
|                         |        |                                                                                          |                                                                                       |
| user/create             | POST   | `session`, `firstname`, `lastname`, `email`, `password`, `active`, `superadmin`          | `id`, `firstname`, `lastname`, `email`, `session`, `password`, `active`, `superadmin` |
| user/get                | GET    | `session`, `id`                                                                          | `id`, `firstname`, `lastname`, `email`, `session`, `password`, `active`, `superadmin` |
| user/update             | POST   | `session`, `id`, `firstname`, `lastname`, `email`, `active`, `superadmin`                | `id`, `firstname`, `lastname`, `email`, `session`, `password`, `active`, `superadmin` |
| user/passwd             | POST   | `session`, `id`, `password`                                                              | `id`, `firstname`, `lastname`, `email`, `session`, `password`, `active`, `superadmin` |
| user/view               | GET    | `session`                                                                                | `users[] {id, firstname, lastname, email, session, password, active, superadmin}`     |
| user/login              | POST   | `email`, `password`                                                                      | `session`                                                                             |
| user/logout             | POST   | `session`                                                                                | `logouted`                                                                            |
