profile-it
=============================

A web app to profile MongoDB.

### Setup
First, you need to have a local instance of MongoDB running. ([installation instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/))

Second, allow a non-root user to run `dtrace`. WARNING: Do not do this on a production server since dtrace allows low level sniffing of keyboard input, etc.
```bash
sudo chmod a+s /usr/sbin/dtrace
```
Finally, in the root directory of this project, run:
```bash
npm install -g grunt-cli
npm install -g bower
npm install
bower install
grunt serve
```

### Usage
Go to [localhost:9000](http://localhost:9000) to see the Profile-It webapp.


