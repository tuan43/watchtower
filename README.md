Watch Tower app with stateless authentication using jwt for serving up authKey. Uses TOTP based 2FA w/ bypass available.

## Available Scripts

In the project directory, you can run:

### `npm install` from the server and root dir.

### `npm start` from the root dir (development use)

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.

### `node server.js`

Runs the production app from server dir

### users.js

JSON array in lieu of a db for now. Authentication works by checking if username, password AND secret/bypass is correct. 
secret is used to verify 2FA. hashedBypass is used to bypass 2FA.
`[{
  username: 'foo',
  id: '1228149cf9f3',
  secret: 'abc1234567824424242',
  hashedBypass: '$2a$04$JDxz5H4oKwbvd99yCGKizu9v9juTd.EtkI3iMRHq0eFPdRp7Bc/A2',
  hashedPassword: '$2b$10$0kdaeo/a9T.cXEvppsl8oO6S0b3a2slHgZL.7zb3EdxCrGS3OVrLq',
  authKey: ['1234 5678']
}];`