FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt /app

#make virtual environment
RUN python -m venv venv

#activate virtual environment
RUN . venv/bin/activate

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 5000

CMD ["python", "app.py"]