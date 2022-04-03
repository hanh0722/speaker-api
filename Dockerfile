FROM node:17

#Working Dir

WORKDIR /usr/src/app

#copy package.json

COPY package*.json ./

# ENVIRONMENT

ENV CLOUDINARY_KEY=539275864181413
ENV CLOUDINARY_KEY_SECRET=FcInIZCmHK02vPQypmTB8Cdww8Y
ENV CLOUD_NAME=plenty-react-api
ENV MONGODB_USERNAME=admin-3
ENV MONGODB_PASSWORD=VNriFz5qjriOEp44
ENV SENDGRID_API=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
ENV TWILIO_SID=ACd1edbd7e82d4600c389fad31ec346e74
ENV TWILIO_AUTH_TOKEN=3a23908fcdc4f0de30c0d86e8c12ae1b
ENV ADMIN_EMAIL=AnhNDH.B19CN022@stu.ptit.edu.vn
ENV TWILIO_NUMBER=+19046011556

# Install 

RUN npm install

# Copy source files

COPY . .

# Build

RUN npm run build


# Expose the API Port

EXPOSE 1337

CMD [ "node", "dist/app.js" ]

