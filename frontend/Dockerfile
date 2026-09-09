# Portfolio frontend image: build the static bundle, then serve it from nginx.
#     docker build -f frontend/Dockerfile -t portfolio-web ./frontend
#
# IMPORTANT: Vite substitutes VITE_* variables at BUILD time, not at run time.
# Setting them on the running container has no effect - they have to be passed
# as build arguments, which is what the ARG/ENV pairs below are for.

# ---- Build ---------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=""
ARG VITE_ENABLE_BACKEND="true"
ARG VITE_RESUME_URL="/resume/resume.pdf"
ARG VITE_PROJECT_NOIRMORE_GITHUB=""
ARG VITE_PROJECT_NOIRMORE_DEMO=""
ARG VITE_PROJECT_WOLFCAFE_GITHUB=""
ARG VITE_PROJECT_WOLFCAFE_DEMO=""

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_ENABLE_BACKEND=$VITE_ENABLE_BACKEND \
    VITE_RESUME_URL=$VITE_RESUME_URL \
    VITE_PROJECT_NOIRMORE_GITHUB=$VITE_PROJECT_NOIRMORE_GITHUB \
    VITE_PROJECT_NOIRMORE_DEMO=$VITE_PROJECT_NOIRMORE_DEMO \
    VITE_PROJECT_WOLFCAFE_GITHUB=$VITE_PROJECT_WOLFCAFE_GITHUB \
    VITE_PROJECT_WOLFCAFE_DEMO=$VITE_PROJECT_WOLFCAFE_DEMO

RUN npm run build

# ---- Serve ---------------------------------------------------------------
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=4s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
