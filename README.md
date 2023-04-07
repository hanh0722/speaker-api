BE API

To run the project, install 4 steps:

Step 1: Install NodeJS with the url:

[https://nodejs.org/en]

NOTE: use nodejs version lower 18

To switch easily, you can use NVM packages

[https://github.com/nvm-sh/nvm]

Step 2: Install packages with command using npm

```bash
npm install
```

Step 3: Add environment variables file

Create a file in the root folder, check the current directory with command

```bash
pwd
```

Then create a file with the name

```bash
nodemon.json
```

Add info to nodemon.json file:

```bash
{
    "env": {
        "CLOUDINARY_KEY": "539275864181413",
        "CLOUDINARY_KEY_SECRET": "FcInIZCmHK02vPQypmTB8Cdww8Y",
        "CLOUD_NAME": "plenty-react-api",
        "MONGODB_USERNAME": "admin-3",
        "MONGODB_PASSWORD": "VNriFz5qjriOEp44",
        "SENDGRID_API": "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",
        "TWILIO_SID": "ACd1edbd7e82d4600c389fad31ec346e74",
        "TWILIO_AUTH_TOKEN": "3a23908fcdc4f0de30c0d86e8c12ae1b",
        "ADMIN_EMAIL": "AnhNDH.B19CN022@stu.ptit.edu.vn",
        "TWILIO_NUMBER": "+19046011556",
        "STRIPE_KEY": "sk_test_51Kuq9XDJ4bPJBA62qDKEVMsdh6ZBmPs9h2N3OyuD1Pg0yJ1D3XZVLrGagSBmI7XnVTXqIvhSerV2Xi3AxqnaDZP200mKdADXnW"
    }
}
```

Step 4: Run the project with command

```bash
npm run dev
```

Server in local in port 9000