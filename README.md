# orbital-2021-app

=======

## Setup

### Prerequisites:

1. MongoDB Atlas account
2. Github account
3. npm

### Steps:

1. Clone the github repository to your local computer
2. Create your collection in mongodb, and get the connection string needed to connect your app to the collection. Be sure to note down the password as well.
3. Create a file named ".env" in the root folder. Inside, type "MONGODB_URI=" and enter your connection string behind. You should have something like the following: `MONGODU_URI=mongodb+srv://...`
4. Run the command npm run install-app
5. Run the command npm run start-app
6. Now your backend api should be running on localhost:5000, and the app will be running on localhost:3000.

If you encounter any issues with steps 4 and 5, try the following:
1. Install npm on the root folder.
2. In the root folder, run the command `npm run server`.

The server should be connected and running on localhost:5000.

1. Move to the client folder on another command line interface
2. Run the command `npm start`.

The application should open up on localhost:3000.
