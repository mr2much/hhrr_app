Check this for the COEP error: https://github.com/helmetjs/helmet/issues/343

App is now deployed on Render at: https://managerhhrr.onrender.com/api/v1/candidatos/

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

#### Candidatos

- TODO: Fix: Card tooltips when you click on a Candidato marker on the map
- TODO: Improve Candidato index page with cards
- TODO: Ensure that only images can be selected when creating or editing a Candidato's image
- TODO: Implement sending emails to a Candidato if he gets selected for a position.
  - TODO: Implement sending a confirmation email when Candidato registers.
- TODO: Implement functionality to allow Candidato to apply for a specific position.
  - TODO: Recruiter should be able to see the Candidates that applied for a specific job posting.
- TODO: Add functionality to display which columns I want to see on Index page.
- [x]: Fix image updating when Image is changed for Candidato
  - [x]: Change implementation in imgUtils
  - [x]: Change implementation in findOneAndUpdate
- [x]: Group Candidato data in NEW Form and EDIT Form
  - ~~TODO: Route handlers should destructure Candidato from `req.body`~~ Candidato data is send to the server from the client with a `fetch`
- [x]: Implement error handling
  - [x]: Add Candidato validation
    - [x]: Install JOI
    - [x]: Create JOI Schema for Candidato
    - [x]: Create EJS Error template
    - [x]: Create Error Handling Middleware
    - [x]: Create function to capture async errors
    - [x]: Create Error Class
    - [x]: Add form validation
      - [x]: Add form validation on Candidato creation
      - [x]: Add form validation on Candidato edition

#### Profiles

- TODO: Implement Seeding to Profiles collection

#### Departments

- TODO: Implement Seeding to Departments collection

#### Niveles Academicos

#### Map

- TODO: Add cluster behavior to the Markers

#### Bugs

- TODO: Fix veritical centering on:
  -TODO: Candidato index view.
  - TODO: Candidato new form
  - TODO: Perfiles index view
  - TODO: Perfiles new form
  - TODO: Departamentos index view
  - TODO: Departamento new form.
  - TODO: Mapa view
  - [x]: Error EJS Template
- TODO: There is a style flickering when using pagination.
- TODO: Flash of unstyled content
- [x]: ~~Bug: Card should be more vertically centerd on Candidato details view~~
- [x]: ~~Main content not being vertically centered correctly.~~ There was some unnecesary styling being applied to the body

#### Client-Side

- TODO: Add previous and next buttons on Candidato index view

#### Server-Side

#### General

- TODO: Completely separate server side code from client-side code
- TODO: Fix stylings on smaller views
- TODO: Implement mobile view
- TODO: Implement Pagination
  - [x]: ~~Add Swiper.js~~ Removed
    - [x]: ~~Add swiper css~~ Removed
    - [x]: ~~Add Swiper JS~~ Removed
    - [x]: Implement pagination to Candidato details view
      - [x]: Implement paginated query results on the server
      - [x]: ~~Add swiper on client side.~~ Removed
    - TODO: Implement pagination to Profile details view
      - TODO: Implement paginated query results on the server
      - [x]: ~~Add swiper on client side.~~ Removed
    - TODO: Implement pagination to Department details view.
      - TODO: Implement paginated query results on the server
      - [x]: ~~Add swiper on client side.~~ Removed
- TODO: Implement multi-language to the app
- TODO: Add expand functionality to Department profiles in detail view
- TODO: Add expand functionality to Profile view
- TODO: Implement error handling for geoUtils
- TODO: Implement error handling for imgUtils
- TODO: Add radio buttons for areas
  - TODO: Depending on selected radio buttons, display profiles for associated area
  - [x]: Remove old implementation of profiles with array
- TODO: Ensure that only the countries in the `countrynames` file can be stored in Mongo
- TODO: Ensure that only the regions found in `geojson_chart_data` can be stored in Mongo
- TODO: Fix folder organization for the project
- TODO: Fix mobile first display
- TODO: Fix validar cedula, account for other types of ID's
  - TODO: Add checkbox with different types of ID's. ex: Cedula, Passport
- TODO: Marker should be centered on selected `country` (default `Dominican Republic`)
- TODO: Add `next` and `previous` buttons on the `map` view, to traverse between displayed Markers.
  - TODO: Add panning effect when moving towards a Marker.
- TODO: Add `region groups` when there are more than one Candidato in the same `region` (Might have to use a `for loop` when creating the HTML code for the popup). Might have to add an object where the key is the `region`
- TODO: Markers should be colored according to the Candidato's salary expectations.
- TODO: Add filters, to filter displayed markers that match the criteria.
- TODO: Add effects similars to this example: https://leafletjs.com/examples/choropleth/
  - TODO: Add `zoom in` when a marker is clicked, `zoom out` when the same marker is clicked again.
- TODO: Add filters by criteria
  - TODO: Add filter by `age`
  - TODO: Add filter by `labora actualmente`
  - TODO: Add filter by `expectativa salarial`
  - TODO: Add filter by `Nivel academico`
  - TODO: Add filter by `Departamento`
  - ~~Add filter by `pais`~~
  - ~~Add filter by `region`~~
  - [x] Add filter by `perfil del candidato`
- TODO: Add sort by criteria
  - Add sort by `age`
  - Add sort by `expectativa salarial`
- TODO: Image for Candidato should only be created if INSERT or UPDATE were successful.
- TODO: Check how to use `axios` for fetch requests on client side
- [x]: Create paginatedResults middleware in a separate file.
- [x]: Improve Profile views
- [x]: Improve Department views
- [x]: Handle image upload without using `P5`
  - [x]: Add multi-part form
  - [x]: Install multer
  - [x]: Remove fetch requests from Client-Side
- [x]: Add `next` and `previous` buttons on `view one` view, to traverse between Candidatos
- [x]: Change Map library from amCharts to Leaflet
- [x]: Move Candidato Model code, to a separate file
  - [x]: Use Candidato Model file on the seeds file, and Candidatos routes
- [x]: When a Candidato is deleted, corresponding image should also be deleted from the path.
- [x] ~~BUG: Default `user.png` is being deleted on Candidato deletion.~~
- [x]: When a Candidato is updated, old image should be deleted, new image should be created on the path.
- [x]: Fix `new.js` just as I did with `edit.js` for new Candidatos
- [x]: Fix `fetch` on for new form.
- [x]: Add route on server side to create new Candidatos
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
