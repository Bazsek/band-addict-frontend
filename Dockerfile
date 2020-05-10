FROM node:13.14.0

WORKDIR .

ENV PATH ./node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli@7.2.4

COPY . .

CMD ng serve --host 0.0.0.0
