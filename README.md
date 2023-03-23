Adonis Project

## Setup

1. Run `npm install`
2. Create file `.env` and copy the code inside from file `.env.example`
3. Download [docker](https://www.docker.com/) (if you don't already have it)
4. Run script `npm run create-db`
5. Run script `npm run migrations`
6. Start the server with `npm run dev`

### Further information

AdonisJS [documentation](https://docs.adonisjs.com/guides/introduction)

How to add and use Adonis validators [here](https://docs.adonisjs.com/guides/validator/introduction)

Lucid ORM and models [here](https://docs.adonisjs.com/guides/models/introduction)

How to make seeders [here](https://docs.adonisjs.com/guides/database/seeders)

### How to add 'repository'

1. In the folder `contracts` find the file named `repositories.ts`
2. Declare you repository like this

```
declare module '@ioc:Repositories/{Name}Repository' {
   import {Model} from 'App/Models/{Model}'
   export interface {Name}RepositoryContract {
   {Function name} ({parameters}): Promise<{Model (What it returns)}>
   }

const {Name}Repository: {Name}RepositoryContract
export default {Name}Repository
}
```

3. Then create a file`{Name}Repository.ts`in the folder`app\Repositories` 4. Inside the file define the repository

```
import { {Name}RepositoryContract } from '@ioc:Repositories/{Name}Repository'
import {Model} from 'App/Models/{Model}'

export default class {Name}Repository implements {Name}RepositoryContract {
  public async get{Model}(): Promise<{Model}> {
    //some function
    return model
  }
}
```
