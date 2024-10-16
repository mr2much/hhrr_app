Check this for the COEP error: https://github.com/helmetjs/helmet/issues/343

# Express API Starter

How to use this template:

```sh
npx create-express-api --directory my-api-name
```

Includes API Server utilities:

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
- [cors](https://www.npmjs.com/package/cors)
  - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Development utilities:

- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [eslint](https://www.npmjs.com/package/eslint)
  - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [jest](https://www.npmjs.com/package/jest)
  - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [supertest](https://www.npmjs.com/package/supertest)
  - HTTP assertions made easy via superagent.

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm test
```

## Development

```
npm run dev
```

## TODOs

- TODO: Marker should be centered on selected `country` (default `Dominican Republic`)
- TODO: Add `next` and `previous` buttons on `view one` view, to traverse between Candidatos
- TODO: Add `next` and `previous` buttons on the `map` view, to traverse between displayed Markers.
  - TODO: Add panning effect when moving towards a Marker.
- TODO: Add `region groups` when there are more than one Candidato in the same `region` (Might have to use a `for loop` when creating the HTML code for the popup). Might have to add an object where the key is the `region`
- TODO: Markers should be colored according to the Candidato's salary expectations.
- TODO: Add filters, to filter displayed markers that match the criteria.
- TODO: Add effects similars to this example: https://leafletjs.com/examples/choropleth/
  - TODO: Add `zoom in` when a marker is clicked, `zoom out` when the same marker is clicked again.
- [x]: Change Map library from amCharts to Leaflet
- TODO: Add filters by criteria
  - Add filter by `age`
  - Add filter by `labora actualmente`
  - Add filter by `perfil del candidato`
  - Add filter by `expectativa salarial`
  - Add filter by `Nivel academico`
  - Add filter by `pais`
  - Add filter by `region`
- TODO: Add sort by criteria
  - Add sort by `age`
  - Add sort by `expectativa salarial`
- [x]: Move Candidato Model code, to a separate file
  - [x]: Use Candidato Model file on the seeds file, and Candidatos routes
- TODO: Image for Candidato should only be created if INSERT or UPDATE were successful.
- [x]: When a Candidato is deleted, corresponding image should also be deleted from the path.
- [x] ~~BUG: Default `user.png` is being deleted on Candidato deletion.~~
- [x]: When a Candidato is updated, old image should be deleted, new image should be created on the path.
- [x]: Fix `new.js` just as I did with `edit.js` for new Candidatos
- [x]: Fix `fetch` on for new form.
- [x]: Add route on server side to create new Candidatos
- TODO: Check how to use `axios` for fetch requests on client side
- [x]: On `edit.js` fix code to extract image from image input
- [x]: On server side, add code to extract and save image on `/res/img/` folder, and store image path for candidato.
- [x]: Install EJS
  - [x]: Create Views folder
    - [x]: Create view for home
    - [x]: Create view for new candidato
    - [x]: create view for view candidato
    - [x]: create view to edit candidato
  - [x]: Create folders to serve static files `css, js`
  - [x]: Create Partials folder
    - [x]: Create partial for navbar
    - [x]: create partial for <head>
    - [x]: create partial for <footer>
- [x]: Install Mongoose
  - [x]: create schema for candidato
  - [x]: create model for candidato
  - [x]: create route for candidato CRUD
    - [x]: create route for insert new candidato
    - [x]: create route to query all candidatos
    - [x]: create route to query one candidato
    - [x]: create route to update one candidato
    - [x]: create route to delete one candidato
- [x]: Install method-override
