FROM node:alpine

WORKDIR /usr/src/app

COPY mdb-angular-ui-kit-8.0.0.tgz ./

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install --no-package-lock --force

COPY . /usr/src/app

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
