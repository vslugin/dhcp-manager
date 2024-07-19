# dhcp-manager

## Setup

### Setup Rabbitmq and Postgres

```sh
docker compose up -d
```

### Run application manually

```sh
npm install
cp .env_example .env
npm start
```

### Install application as systemd service

```sh
./install-systemd-service.sh
```

### Uninstall application as systemd service

```sh
./uninstall-systemd-service.sh
```

## Usage

### Open in browser

```
http://<server_ip>:8008
```

### Login

Login with

```
login=password=admin
```