# Teampulse
![TeamPulseScreen](TeamPulseScreen.png)

## Důležité odkazy ke studiu / projektu
- [Zadání projektu](https://uuapp.plus4u.net/uu-dockit-maing02/4e68298f1658473e9bf5692272883290/document?documentId=64ca0852a584300036f31e3e) obsahuje všechny požadavky na projekt.
- [Projektový portál](https://uuapp.plus4u.net/uu-dockit-maing02/4e68298f1658473e9bf5692272883290/document?documentId=6502e8b919026200367a8d60) workshopu, hodnocení, harmonogramu a týmů.
  - [Business Request](https://uuapp.plus4u.net/uu-bookkit-maing01/ce654e591da546fabe9f39e68670fb87/book) kniha (User Stories, Vize, atd.)
  - [Business Model](https://uuapp.plus4u.net/uu-bookkit-maing01/8c657f0dd6dd4278bfb6924afe55e049/book) kniha (Actors, Use Cases, atd.)
  - [Application Model](https://uuapp.plus4u.net/uu-bookkit-maing01/eeb83176237f4ec29040befc16fa05fa/book) kniha (Route, Schema, atd.)
  - [uuSprintMan](https://uuapp.plus4u.net/uu-sprintman-maing01/1cc56c23ce5448c08d32ca7d490f26ab/sprint/current) project management (Backlog, Tasks, atd.)

- Případová studie **uuJokes**:
  - [uuJokes](https://uuapp.plus4u.net/uu-jokes-maing01/4ef6a7b01b5942ecbfb925b249af987f/jokes) - Odkaz na aplikaci
  - uuJokes - [Business Requests](https://uuapp.plus4u.net/uu-bookkit-maing01/a04c8463649b425fb8b46076c0c5e5d0/book/page?code=home)
  - uuJokes - [Business Model](https://uuapp.plus4u.net/uu-bookkit-maing01/a129e74e3bcc4fe4a4a95f5e4bb494ed/book/page?code=home)
  - uuJokes - [Application Model](https://uuapp.plus4u.net/uu-bookkit-maing01/71f8d7b5cfdc4336b0abfe47b3cb237b/book/page?code=home)

## Instalace potřebného SW
- Visual Studio Code - https://code.visualstudio.com/Download
- Node.js - https://nodejs.org/en/download
- Git - https://git-scm.com/downloads
- Tester API serveru (GET/POST):
  - Insomnia - https://insomnia.rest/download
  - Postman - https://www.postman.com/downloads/

## Stažení a spuštění projektu
- Příkaz `git clone https://github.com/Neolker/TeamPulse` anebo pomocí GUI ve VSCode
- Otevřít si dva terminály, první pro **server**:
  - Ze složky serveru `cd .\backend\`
  - Příkaz `npm i` nainstaluje všechny potřebné balíčky (Express.js apod.), stačí spustit jednou
  - **Server** potom spustíme příkazem `npm start`
  - Měl by potom **server** běžet na http://localhost:8000
  - Zastavit **server** jde potom klávesovou zkratkou `CTRL + C`, napsáním `Y` a potvrzením `ENTER`
  - Opětovné spuštění pomocí `npm start` - například po změně v kódu serveru (nezapomeňte uložit!) nebo si pomůžete `šipkou nahoru` v terminálu pro listování příkazů z historie
- V druhém terminálu si spustíme **client**:
  - Opět se přesuneme do složky clienta  `cd .\frontend\`
  - Příkaz `npm i` nainstaluje všechny potřebné balíčky (React.js apod.)
  - **Client** potom spustíme stejným příkazem `npm run dev`
  - **Client** by se měl spustit sám v prohlížeči na adrese: http://localhost:5173/
  - Ukončit **client** potom stejnou zkratkou `CTRL + C`

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
