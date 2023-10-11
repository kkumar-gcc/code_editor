# Text Editor Installation Instructions

## How to Run the Project

### 1. Requirements

Make sure you have the following software installed on your system:

- [Prisma DB](https://prisma.io)
- [Minio](https://min.io) account
- [Node.js](https://nodejs.org)
- [GitHub](https://github.com) account
- Any code editor (Preferably [Visual Studio Code](https://code.visualstudio.com))

### 2. Clone the Repository

Clone the repository to your local environment using the following command in the terminal or command prompt:

git clone https://github.com/kkumar-gcc/CS455

### 3. Migrate the Database


npx prisma migrate dev


### 4. Install Dependencies
Open the project in your preferred code editor and run the following command in the terminal:

npm install

### 5. Set Environment Variables

Open the .env file and set the following environment variables:

NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_client_id
DATABASE_URL=your_database_url
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=your_minio_bucket
MINIO_URL=your_minio_url

Note: You can copy the .env.example file to .env and replace the placeholder values accordingly.

### 6. Run the Project

Start the project by running the following command:

npm run dev

The application will be accessible at http://localhost:3000/folders
