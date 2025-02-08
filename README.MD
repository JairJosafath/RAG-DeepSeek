# 01 Setup

## Pre-requisites
- Python 3.6 or higher
- Pip
- Docker
- Git

## Setup Project
1. Clone the repository
```bash
git clone https://github.com/JairJosafath/RAG-DeepSeek.git
git checkout 01-setup
```
2. Install the dependencies
There are 2 ways to install the dependencies. 
We won't need the dependencies to run the application, since that will be done via docker.
But it will help with code completion and debugging.

```bash
#This script setsup your virtual environment and installs all the required packages
# You can manually run these scripts or use can run ./scripts/setup-venv.sh

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/Scripts/activate

# Install the required packages
pip install -r backend/requirements.txt
```
## Running & Testing the application
1. Run the docker-compose file
```bash
docker-compose up
```

On Mac you might run into port related issues. You can change the ports in the `compose.yaml` file. If 5000 is the port that is already in use, you can change it to another port, you have todo some refactoring in the following files:
1. compose.yaml:10
2. compose.yaml:10 change "5000:5000" to "5001:5000"
3. frontend\deepseek-rag\nginx.conf:15 
4. tests\01-postman.test.json:


2. Open your browser, go to `http://localhost/` and send some messages to the chatbot. It should respond with a dummy message.

3. Test the backend with a tool like postman. you can use the postman collection json file `tests\01-postman.test.json` to test the backend with postman. The endpoint is `http://localhost:5000/`
