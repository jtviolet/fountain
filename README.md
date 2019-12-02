# Fountain
Registration, for corporate, internal hackathons!

Fountain is a registration system (based on [Quill](https://github.com/techx/quill)) designed especially for corporate, internal hackathons. For the hackers, it’s a clean and streamlined interface to submit registration and confirmation information. For hackathon organizers, it’s an easy way to manage applications, view registration stats, and more!

![Login Splash](./docs/images/screenshots/login.png)

# Features
## Fountain for Users
### Dashboard
![Dashboard](./docs/images/screenshots/dashboard.png)

After users login, the dashboard displays the user’s application status and status-specific prompts to resend a verification email, view/edit their application or confirmation forms.

Statuses:
- Unverified: users have not verified the email address they registered with
- Incomplete, registration open: the user has not submitted their application, but the registration deadline has not passed
- Incomplete, registration closed: the user has not submitted, but the registration deadline has passed
- Submitted, registration open
- Submitted, registration closed
- Admitted / unconfirmed: the user has been admitted to the event, but has not confirmed their attendance and submitted their confirmation form
- Admitted / confirmation deadline passed: the user has been admitted, but did not confirm their attendance before the deadline
- Waitlisted: the user was not admitted to the event
- Confirmed: the user has been admitted and has confirmed their attendance
- User declined admission: the user has been admitted, but will not be attending the event

### Application
![Application](./docs/images/screenshots/application.png)

The Application tab takes users to their registration or confirmation form.

### Team Registration
Hackathons commonly allow participants to register and be admitted as a team. The Team tab allows users to create or join a team with other users.

## Fountain for Admins
Admins can view stats, look through applications, or edit settings from the Admin panel.

### Stats
![Stats](./docs/images/screenshots/stats.png)

The Stats tab summarizes useful registration statistics on the number of users in each stage of the process, demographic information, and miscellaneous event preferences like shirt sizes, dietary restrictions, or reimbursement requests.

### Users Table
![Users table](./docs/images/screenshots/admin-users.png)

The Users tab displays a table of users where admins can:
1. Search for a user by name
2. Quick-view user applications in a pop-up modal
3. See a user’s application status (verified, submitted, admitted, and confirmed) at-a-glance
4. See responses to other miscellaneous fields on the application
5. Open and edit an individual application
6. Admit users manually
7.  Mark users as checked-in at the event day-of

### Settings
![Settings](./docs/images/screenshots/settings.png)

On the Settings tab, admins can easily control their event application timeline by setting registration / confirmation deadlines. They can also write custom waitlist, acceptance, and confirmation copy that users will see on their dashboard throughout the application process. The custom copy is interpreted as Markdown, so HTML and images can be added.

# Setup
### Requirements
| Requirement                                 | Version |
| ------------------------------------------- | ------- |
| [Node.js](http://nodejs.org)                | `10.13+`  |
| [MongoDB](www.mongodb.com/) | `4.0+`  |

Run the following commands to check the current installed versions:

```bash
node -v
mongo --version
```
How to upgrade to latest releases:
- Node.js: https://nodejs.org/en/download/
- MongoDB: https://docs.mongodb.com/manual/administration/install-community/

### Deploying locally
Getting a local instance of Fountain up and running takes less than 5 minutes! Start by setting up the database. Ideally, you should run MongoDB as a daemon with a secure configuration (with most linux distributions, you should be able to install it with your package manager, and it'll be set up as a daemon). Although not recommended for production, when running locally for development, you could do it like this

```bash
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1
```

Install the necessary dependencies:
```bash
npm install
```

We use `dotenv` to keep track of environment variables, so be sure to stop tracking the `.env` file in Git:
```bash
git update-index --assume-unchanged .env
```


Edit the configuration file in `.env` for your setup, and then run the application:
```bash
gulp server
```

### Deploying to AWS Lambda
You will need to first install the serverless framework:
```
npm install -g serverless
```

Remove the node_modules directory, and reinstall to get the dependencies for your local computer:
```
npm install
```

Then, build the project:
```
gulp build
```

Make sure you delete your node_modules folder and then run the following docker command to build all of the native node modules for Amazon's Linux (https://github.com/lambci/docker-lambda)
```
docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs10.x npm install
```

Then run serverless deploy
```
serverless deploy
```

# Customizing for your event
### Copy
If you’d like to customize the text that users see on their dashboards, edit them at `client/src/constants.js`.

### Branding / Assets
Customize the color scheme and hosted assets by editing `client/stylesheets/_custom.scss`. Don’t forget to use your own email banner, favicon, and logo (color/white) in the `assets/images/` folder as well!

### Application questions
If you want to change the application questions, edit:
- `client/views/application/`
- `server/models/User.js`
- `client/views/admin/user/` and `client/views/admin/users/` to render the updated form properly in the admin view

If you want stats for your new fields:
- Recalculate them in `server/services/stats.js`
- Display them on the admin panel by editing `client/views/admin/stats/`

### Email Templates
To customize the verification and confirmation emails for your event, put your new email templates in `server/templates/` and edit `server/services/email.js`

# Contributing
Contributions to Fountain are welcome and appreciated! Please take a look at [`CONTRIBUTING.md`][contribute] first.

# License
Copyright (c) 2015-2016 Edwin Zhang (https://github.com/ehzhang). Released under AGPLv3. See [`LICENSE.txt`][license] for details.
