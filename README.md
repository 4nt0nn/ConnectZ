# ConnectZ

This is a simple social connection application created for a university assignment in a multi-platform applications course.

## Getting started

In order to get started with this project, you can choose one of two things.</br>
Either clone the project using the git clone + the link in your terminal/prompt.</br>
Or donwload and expand the Zip file.</br>

Once the project has been downloaded follow the installation guide to install the dependencies and follow the start guide to start the application.

### Prerequisites

The following needs to be installed on your machine before
you can get started with the project.</br>

- `Node.js`
- `Git`

You will also need to setup projects at Firebase and Agora.</br>

- Follow the instructions at [Firebase](https://firebase.google.com/)
- Follow the instructions at [Agora](https://www.agora.io/)

### Installation

All dependencies for this project can be installed by navigating to the root
of the project using your terminal/prompt and entering: </br>

`npm i`

The project packages include, for example:</br>

- Redux
- React-redux-firebase
- Redux-thunk
- Redux-firestore
- Firebase
- Agora-rtc-sdk
- Material-ui
- React-router
- React-router-dom

### Using environment variables

In order to get things running, you will need to (in your newly created Firebase project) add a new
web application and generate a JSON object "firebaseConfig" which will hold your project settings, api key etc.
Follow the example.env and add a new .env file in the project and paste all corresponding information in the file
and under the correct key. Setup cloud firestore and add the collections that you think suits the application best.
For example, "events", "users" and "rooms".

The same goes for agora. Start a new project and generate your application id, channel name and a token and paste
these in their corresponding location in the .env file.

### Starting the application

The application can be started by entering the following in the project directory:</br>

`npm start`

This will run the application in development mode at [http://localhost:3000](http://localhost:3000)

## License

This project is licensed under the MIT License.
