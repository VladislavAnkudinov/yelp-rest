`yelp-rest` is **a lightweight, easy to deploy REST wrapper for Yelp 2.0 API.**

# Run
**To run the server do the following:**

- Clone the repo
- Create `.env` file in the same place as `.env-example` (root directory)
- Put your environment variables in `.env` file, e.g. `Yelp Mange API access` stuff
- Install major dependencies `npm install --production`
- Fire `npm start`


# Development

Repo destributed prebuilded so that you do not have to install everithing including `devDepencencies` to run the server.
If your prefer to build everything by yourself and/or doing source editings:

**Install all dependencies:**
```sh
npm install
```

After installation of `devDependencies` you wil be abble to edit and build sources, check code style and run tests.

**For rebuilding and restarting during development:**
```sh
npm run watch
```

**For production building:**
```sh
npm run build
```

**For testing:**
```sh
npm test
```

**For code style checking:**
```sh
npm run lint
```

Sources distributed with `.ide` directory containing WebStorm settings to easily achive same development experience
with other WebStrorm users.

**For JSDoc generation:**
```sh
npm run jsdoc
```

It generates `jsdoc` directory in the root of the project

# License

[MIT](./LICENSE.txt).

# See Also

- How to use Yelp's API with Node: <https://arian.io/how-to-use-yelps-api-with-node/>.
- yelp-api: <https://github.com/Yelp/yelp-api>.
- node-yelp: <https://github.com/olalonde/node-yelp>.
