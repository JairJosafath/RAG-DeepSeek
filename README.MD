# 02 Add ollama

## Pre-requisites
- NVIDIA GPU (optional)

## Setup Project
### 1. Update the dependencies

```bash
pip install -r backend/requirements.txt
```

### 2. Create an external volume for the ollama models. This is necessary to persist the models between container restarts.

```bash
docker volume create ollama_vol
```

## Running & Testing the application
### 1. Run the docker-compose file
```bash
docker-compose up 
```
you can also use flags such as `--build` to rebuild the images, `-d` to run in detached mode, and `--force-recreate` to recreate the containers. Pick and choose the flags as needed.

```bash
docker-compose up --build -d --force-recreate
```

### 2. Before we can test the ollama server, we need to pull the models from the ollama server. To do this, run the following command:
```bash
docker exec rag-deepseek-ollama-1 ollama pull deepseek-r1:7b
```
This might take a while, as the model is being downloaded from the ollama server. When the download is complete, you should see a success message. You can continue to the next step.

### 3. Open your browser, go to `http://localhost/` and send some messages to the chatbot. The title should say Deepseeker-01.

### 4. Test the backend with a tool like postman. you can use the postman collection json file `tests\postman.test.json` to test the backend with postman. The endpoint is `http://localhost:5000/`
