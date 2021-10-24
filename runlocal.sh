# This script sets up the environment variables needed to access
# the nonprod keyvault then starts the app in that environment. The
# actual keyvault credentials are set by a callout to localenv.sh. 
# The localenv.sh is not a checked in file. This script is only used
# for non-production scenario
source ./localenv.sh

node /usr/src/app/dist/app.js
