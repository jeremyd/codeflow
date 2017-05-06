FROM golang:1.8-stretch

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV APP_PATH /go/src/github.com/checkr/codeflow

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

RUN apt-get update && apt-get install -y gnupg2
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - \
  && apt-get install -y nodejs libgit2-dev git

RUN go get github.com/cespare/reflex
RUN npm install gitbook-cli -g

WORKDIR $APP_PATH/dashboard
COPY ./dashboard/package.json ./package.json
RUN npm install

WORKDIR $APP_PATH/docs
COPY ./docs/package.json ./package.json
RUN npm install

COPY . $APP_PATH

WORKDIR $APP_PATH/server
RUN go build -i -o /go/bin/codeflow .

WORKDIR $APP_PATH/docs
RUN gitbook install && gitbook build

WORKDIR $APP_PATH/dashboard
RUN npm run build

WORKDIR $APP_PATH

ENTRYPOINT ["./docker-entrypoint.sh"]
