# Teampulse

!!! IMPORTANT - BEFORE USE BACKEND USE COMMAND: npm install md5 !!!


## API Documentation

- **POST** requests pass parameters in JSON format in **Body**, mostly data from forms
- **GET** requests pass parameters that are part of the URL (route)

| URI                     | METHOD | INPUT                                                                         | OUTPUT                                                                        |
| ----------------------- | ------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| company/create          | POST   | `name`, `description`, `owner_id`                                             | `awid`, `name`, `description`, `owner_id`, `users[] {id,roles[]}`             |
| company/get             | GET    | `awid`                                                                        | `awid`, `name`, `description`, `owner_id`, `users[] {id,roles[]}`             |
| company/update          | POST   | `awid`, `name`, `description`, `owner_id`                                     | `awid`, `name`, `description`, `owner_id`, `users[] {id,roles[]}`             |
| company/view            | GET    | -                                                                             | `companies[] {awid, name, description, owner_id, users[] {id,roles[]}}`       |
| company/add-user        | GET    | `awid`, `user_id`, `roles[]`                                                  | `awid`, `name`, `description`, `owner_id`, `users[] {id,roles[]}`             |
| company/delete-user     | GET    | `awid`, `user_id`                                                             | `awid`, `name`, `description`, `owner_id`, `users[] {id,roles[]}`             |
|                         |        |                                                                               |                                                                               |
| workspace/create        | POST   | `awid`, `name`, `description`, `owner_id`,                                    | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`             |
| workspace/get           | GET    | `id`                                                                          | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`             |
| workspace/update        | POST   | `id`, `name`, `description`, `owner_id`,                                      | `id`, `awid`, `name`, `description`, `owner_id`, `members[] {id}`             |
| workspace/delete        | POST   | `id`                                                                          | `deleted`                                                                     |
| workspace/view          | GET    | -                                                                             | `workspaces[] {id, awid, name, description, owner_id, members[] {id}}`        |
| workspace/add-member    | GET    | `id`, `user_id`,                                                              | `id`,`awid`, `name`, `description`, `owner_id`, `members[] {id}`              |
| workspace/delete-member | GET    | `id`, `user_id`                                                               | `id`,`awid`, `name`, `description`, `owner_id`, `members[] {id}`              |
|                         |        |                                                                               |                                                                               |
| task/create             | POST   | `worspace_id`, `name`, `description`, `solver_id`, `deadline`, `status`       | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status` |
| task/get                | GET    | `id`                                                                          | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status` |
| task/update             | POST   | `id`, `worspace_id`, `name`, `description`, `solver_id`, `deadline`, `status` | `worspace_id`, `id`, `name`, `description`, `solver_id`, `deadline`, `status` |
| task/delete             | POST   | `id`                                                                          | `deleted`                                                                     |
| task/view               | GET    | -                                                                             | `tasks[] {worspace_id, id, name, description, solver_id, deadline, status}`   |
|                         |        |                                                                               |                                                                               |
| user/create             | POST   | `firstname`, `lastname`, `email`, `password`,`active`,`superadmin`            | `id`,`firstname`,`lastname`,`email`,`session`,`password`,`active`,`superadmin`|
| user/get                | GET    | `id`                                                                          | `id`,`firstname`,`lastname`,`email`,`session`,`password`,`active`,`superadmin`|
| user/update             | POST   | `id`,`firstname`,`lastname`,`email`,`active`,`superadmin`                     | `id`,`firstname`,`lastname`,`email`,`session`,`password`,`active`,`superadmin`|
| user/passwd             | POST   | `id`,`password`                                                               | `id`,`firstname`,`lastname`,`email`,`session`,`password`,`active`,`superadmin`|
| user/view               | GET    | -                                                                             | `users[] {id,firstname,lastname,email,session,password,active,superadmin}`    |
| user/login              | POST   | `email`, `password`                                                           | `session`                                                                     |
| user/logout             | GET    | -                                                                             | `logouted`                                                                    |
