# TODO

V tom, co máte upravte následující:

- [x] zabývat se pouze entitami workplace a task - upravit produkty v BM a datové úložiště v AM
  - [x] **add**: Validace na BE a ABL (business logika)
  - [x] **update**: Business Model Book
  - [x]  **update**: Application Model Book
  - [x] **add**: doplnit/vytvorit **workspace-get** do BM a AM knihy (druha a treti)
- [x] aktéři - zabývat se pouze Super User a Member
  - [x] Zamerit se v knihach pouze na **App Owner** a **Member**
  - [x] I na BE řešit pouze **App Owner** a **Member**
- [x] pro workplace zpracovat CMDs create a get - implementace (upravit ABL a DAO) + dokumentace (BM a AM)
  - [x] **fix code**: kontrola session
  - [x] **fix code**: workspace-create (ABL/DAO)
  - [x] **test**: workspace-create po změně ABL/DAO
  - [x] **business logika**: workspace-create
  - [x] **test**: business logiky worskpace-create
  - [x] **fix code**: workspace-get (ABL/DAO)
  - [x] **test**: workspace-get po změně ABL/DAO
  - [x] **business logika**: workspace-get
  - [x] **test**: business logiky worskpace-get
  - [x] **update**: Business Model Book
  - [x] **update**: Application Model Book
- [x] pro task zpracovat CMDs create a list (upravit ABL a DAO) - implementace + dokumentace (BM a AM)
  - [x] **fix code**: kontrola session
  - [x] **fix code**: task-create (ABL/DAO)
  - [x] **test**: task-create po změně ABL/DAO
  - [x] **business logika**: task-create (kontrola session, existence owner_id / company / a pokud je user superadmin, člen nebo vlasntík company)
  - [x] **test**: task-create: test oprvávnění atd.
  - [x] **fix code**: task-view (ABL/DAO)
  - [x] **test**: task-view po změně ABL/DAO
  - [x] **business logika**: task-view (kontrola session, ~~ze ma spravnou roli (client a vyse - coz by meli mit vsichni) a~~ ze je owner anebo member urciteho workspace ve kterem chce zobrazit tasky)
  - [x] **test**: Test business logic of task-view
  - [x] **update**: Business Model Book
  - [x] **update**: Application Model Book
- [x] FE - zpracovat routu workplace detail spolu se seznamem tasků - Admin uvidí tasky všech userů, user uvidí pouze svoje tasky - implementace + dokumentace (AM)

## Extra / Bonus

- [x] Vytvořit lepší data ve storage pro prezentaci
- [x] Nasazeni na cloud / server: http://www.teampulse.cz
- [ ] Refactoring kódu (např. přehlednější podmínky v business logice)
- [ ] Session v headru misto body
- [ ] Prihlaseni 3. stranami (Google)
