These notes are from the original author of this repository. They
contain reference to Azure resources that are private to the author's 
Azure subscription and would need to be re-created for other deployments
of this service.

Authentication to keyvault for containers
https://kevinle.medium.com/securely-store-and-access-secrets-in-azure-keyvault-from-docker-based-app-service-babe463fe57b

Use the right dockerfile for the environment being built
cp Dockerfile.prod Dockerfile
or
cp Dockerfile.dev Dockerfile

Log into Azure first
az login

Then log into the azure container registry before you try to push any containers
az acr login --name tscontent

Notice the docker build command below tags the image using the the azure container registry path in the tag.
The repository in the ACR in Azure will be named mikedice/storageservice and the instance inside the repository will be named prod-1
docker build . -t tscontent.azurecr.io/tscontent_containers/tsiotsvc:nonprod-1
or
docker build . -t tscontent.azurecr.io/tscontent_containers/tsiotsvc:prod-1


Push the image from dev machine to the azure ACR using docker command line
docker push tscontent.azurecr.io/tscontent_containers/tsiotsvc:nonprod-1
docker push tscontent.azurecr.io/tscontent_containers/tsiotsvc:prod-1

For Production:
In the deployed container instance you have to turn on 'System Assigned' identity.
Then copy the GUID for that identity. Use the GUID as the principle ID in the Key Vault's Access Policies screen and 
assign access policies.

For Non-Production
There is an Application Registration in Active Directory called MyIOTApp. This registration has been granted
access to the non-production key Vault. The Tenant ID, Client ID and Client Secret are copied from this registration
and assigned to the environment variables of the non-production dockerfile: Dockerfile.dev. The Azure DefaultIdentityProvider
will first try to use the values from these environment variables to authenticate your container's access to the Key Vault.
Also when running the container locally or just running the app locally outside of a container for debugging these 
same environment variables will be used.