# cdktf-gihtub-provisioner

This is a cdktf app that handles github repositories, groups, users and repository files.

## development


### 1. Create .env file

1. To install internal npm packages from @prefapp, you´ll need to create a Github PAT with `packages:read` permission.

```.env
NPM_AUTH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxx 
```

### 2. Initialize project

```shell
make init
make test
```

![image](https://github.com/user-attachments/assets/e00ceeeb-4e15-43ca-b082-82734461319a)

