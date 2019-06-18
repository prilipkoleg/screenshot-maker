FROM node:10-slim

#ARG EXPOSE=5020
#ENV EXPOSE_PORT $EXPOSE
#EXPOSE $EXPOSE_PORT

# fixed error -> https://superuser.com/questions/1423486/issue-with-fetching-http-deb-debian-org-debian-dists-jessie-updates-inrelease
#RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

RUN apt-get update && \
apt-get install -yq build-essential \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
# ----------------------
# Increased +2m container building (Used For chines characters)
  fonts-wqy-zenhei \
# ----------------------
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils \
  wget
ADD ./ /App
WORKDIR /App
ARG CACHEBUST=1
# Install npm packages
RUN npm install -g pm2
RUN npm install
CMD ["node", "./bin/www"]
