# orbital-2021-app

=======

## Setup

### Prerequisites:

1. MongoDB Atlas account
2. Github account
3. npm
   Also, install npm concurrently.

### Steps:

Step 1: Clone the github repository to your local computer
Step 2: Create your collection in mongodb, and get the connection string needed to connect your app to the collection. Be sure to note down the password as well.
Step 3: Create a file named ".env" in the root folder. Inside, type "MONGODB_URI=" and enter your connection string behind. You should have something like the following: `MONGODU_URI=mongodb+srv://...`
Step 4: Run the command npm run install-app
Step 5: Run the command npm run start-app
Step 6: Now your backend api should be running on localhost:5000, and the app will be running on localhost:3000.

If you encounter any issues with steps 4 and 5, try the following:
Step 4a: Install npm on the root folder.
Step 4b: In the root folder, run the command "npm run server".

The server should be connected and running on localhost:5000.

Step 5a: Move to the client folder on another command line interface
Step 5b: Run the command "npm start".

The application should open up on localhost:3000.
