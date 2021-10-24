FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# These variables are used by DfaultIdentityProvider. Only non-production
# credentials should be stored and accessed this way
COPY dist dist
COPY localenv.sh .
COPY runlocal.sh .

run chmod +x /usr/src/app/localenv.sh
run chmod +x /usr/src/app/runlocal.sh

CMD ["/usr/src/app/runlocal.sh"]


