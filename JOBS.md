## Backend Jobs

- Jobs are isolated scripts that works for scpecific one-time action
- Them can be called from a project command, private Jobs API or scheduled with cron

### Usage from npm command

- call `npm run job list`
- call `npm run job run <job>`

### Usage from jobs API (protected)

- send `User-Agent: Kubera-jobs-API-client` to access the endpoint
- hit `GET /api/jobs` to list registered jobs
- hit `POST /api/jobs/:name/run` to run a job

## Current registered jobs

- `scrape-steamdb-tags-to-categories`: Scrapes [stemdb.info/tags](https://stemdb.info/tags) to update `database.categories` (additions are default `visible=false`)
