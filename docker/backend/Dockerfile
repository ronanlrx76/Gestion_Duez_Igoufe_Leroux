FROM python:3.11-slim

WORKDIR /

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./requirements.txt

RUN pip install --upgrade pip

RUN pip install -r requirements.txt


COPY ./app /app


EXPOSE 8000


CMD ["python", "app/manage.py", "runserver", "0.0.0.0:8000"]