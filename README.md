## First Kubera Backend Api Prototipe

### Run Project

- `docker compose up -d`

After docker, we just use:

- `npx ts-node ./app.ts` or
- `npm run dev`

### Folder Standar

The standar is **kebab-case**.

### Sequelize

To see commands for bbdd:
`sequelize-cli`
For example to create model (this creates migration too) we use:
`sequelize model:create --name category --attributes slug:string,name:string,external_id:string`

### Commands

Example usage:

- `npm run command --name=SyncExternalCategoriesCommand`
