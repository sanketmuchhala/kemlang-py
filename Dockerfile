FROM python:3.12-slim

LABEL org.opencontainers.image.source="https://github.com/sanketmuchhala/Gujju.py"
LABEL org.opencontainers.image.description="KemLang - A Gujarati-flavored programming language"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY pyproject.toml README.md ./
COPY kemlang/ kemlang/

RUN pip install --no-cache-dir .

WORKDIR /workspace

ENTRYPOINT ["kem"]
CMD ["repl"]
