# ==========================================
# STAGE 1: BUILD REACT BUNDLE
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: LIGHTWEIGHT WEB SERVER
# ==========================================
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
