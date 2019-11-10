# Deployment

**Deployed to:** [https://curling-game.appspot.com](https://curling-game.appspot.com)

Commands used when creating the deployment

```
cp -r ~/Downloads/google-cloud-sdk ~/Development/
cd ~/Development
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/endpointscfg.py init
gcloud auth login
gcloud projects create curling-game --set-as-default
gcloud app create --project=curling-game
gcloud app deploy

# authorise cloud build
# https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=curling-game
```
