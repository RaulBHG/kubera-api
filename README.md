## First Kubera Backend Api Prototipe

### Run Project

Before docker, we just use:
`npx ts-node ./app.ts`

### Backend Jobs

See detailed info about backend jobs [**here**](https://github.com/RaulBHG/kubera-api/blob/main/JOBS.md)

### Folder Standar

The standar is **kebab-case**.

### Sequelize

To see commands for bbdd:
`sequelize-cli`
For example to create model (this creates migration too) we use:
`sequelize model:create --name category --attributes slug:string,name:string,external_id:string`
