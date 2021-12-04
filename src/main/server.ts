import { MongoHelper } from '@/infra/db'
import 'module-alias/register'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => { console.log(`listening on port ${env.port}`) })
  })
  .catch(console.error)
