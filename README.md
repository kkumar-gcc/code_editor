![image](https://github.com/kkumar-gcc/CS455/assets/143108119/d27e2615-ba72-4ee7-944c-2b6c81cb552c)**ADDENDUM 2**

# Text Editor Installation Instructions

## How to Run the Project

### 1. Requirements

Make sure you have the following software installed on your system:

- [Prisma DB](https://prisma.io)
- [Minio](https://min.io) account
- [Next.js](https://nodejs.org)
- [GitHub](https://github.com) account
- Any code editor (Preferably [Visual Studio Code](https://code.visualstudio.com))

### 2. Clone the Repository

Clone the repository to your local environment using the following command in the terminal or command prompt:

```properties
git clone https://github.com/kkumar-gcc/CS455
```

### 3. Migrate the Database

```properties
npx prisma migrate dev
```


### 4. Install Dependencies
Open the project in your preferred code editor and run the following command in the terminal:

```properties
npm install
```

### 5. Set Environment Variables

Open the .env file and set the following environment variables:
```bash
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_client_id
DATABASE_URL=your_database_url
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=your_minio_bucket
MINIO_URL=your_minio_url
```

Note: You can copy the .env.example file to .env and replace the placeholder values accordingly.

### 6. Run the Project

Start the project by running the following command:

```properties
npm run dev
```

The application will be accessible at http://localhost:3000/folders

**ADDENDUM 1**

We have created the following tasks and assigned estimated dates for completion of the task.

| Status | Issues | Estimated Date|
| -------|------- | ------------- |
|Completed|Project Setup |14 Sept 23|
|Completed|Implementing Third-Party OAuth Authentication with GitHub (Preferred) |14 Sept 23|
|Completed|File management |14 Sept 23|
|Completed|Implement Basic Text Editing Features|01 Oct 23|
|Completed|Line Numbering |08 Oct 23|
|Completed|Syntax Highlighting for Common Programming Languages |08 Oct 23|
|Completed|Search and Replace Functionality |15 Oct 23|
|Completed|Theme Customization Options|15 Oct 23|
|Completed|Testing|22 Oct 23|

Note:- We are developing a web-based text editor using Next.js as the foundation and integrating Prisma ORM to interact with an SQL database.
