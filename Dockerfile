# ---  BUILD TIME   ---
FROM node:15

# every command is run in this directory
# recommanded but not necessary
WORKDIR /app      

# copy package.json to ./app
COPY package.json .

# install dependencies
RUN npm install

ARG NODE_ENV
RUN if [ "${NODE_ENV}" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

# copy other files into our docker image
COPY . ./
ENV PORT 3000

EXPOSE ${PORT}

#  --- RUN TIME  ---
# when we start a container, we want to tell what command to run
CMD [ "node", "index.js" ] 
