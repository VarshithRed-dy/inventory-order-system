#Build stage: compile dependencies into wheels
FROM python:3.12-slim AS builder

WORKDIR /app
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

#Runtime stage: slim final image
FROM python:3.12-slim

WORKDIR /app

# Run as a non-root user for security.
RUN useradd --create-home appuser

# Install dependencies from the prebuilt wheels.
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

# Copy the application code.
COPY . .

RUN chmod +x entrypoint.sh && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]