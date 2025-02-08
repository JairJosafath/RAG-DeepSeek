# 03 add frontend api

## Running & Testing the application
### 1. Run the docker-compose file
```bash
docker-compose up 
```
you can also use flags such as `--build` to rebuild the images, `-d` to run in detached mode, and `--force-recreate` to recreate the containers. Pick and choose the flags as needed.

```bash
docker-compose up --build -d --force-recreate
```

### 3. Open your browser, go to `http://localhost/` and send some messages to the chatbot. The title should say Deepseeker-03.

### 4. Send a message, and the chatbot should respond to the message using AI.
