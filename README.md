# kibanalytics


## ELK stack sample version

This setup allows to startup an ELK stack for testing purposes.


### Config generation

`make logstash-config`
This will output a sample configuration file based on the values of `.env` file, saving it to `elk/logstash/pipeline/` folder


### Startup
`make elk-startup`

