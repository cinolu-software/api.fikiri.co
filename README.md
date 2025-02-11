# SDG Mapping Solutions API

## 📌 Overview

The **SDG Mapping Solutions API** is built with **NestJS**, designed to map and track progress towards the **Sustainable Development Goals (SDGs)**. The API allows to collect responses, and associate them with SDG indicators for data-driven decision-making.

## 🚀 Features

- 🔹 **Dynamic Form Generation** (like Google Forms)
- 🔹 **User Authentication & Authorization** (JWT-based security & Session)
- 🔹 **SDG Goals & Indicator Mapping**
- 🔹 **Response Collection & Analysis**
- 🔹 **RESTful API**

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MariaDB (TypeORM for ORM)
- **Authentication**: JWT + Passport & Sessions
- **Validation**: class-validator & class-transformer

## 📦 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/v2.api.fikiri.co.git
cd v2-api.fikiri.co
```

### 2️⃣ Install Dependencies

```sh
pnpm i
```

### 3️⃣ Set Up Environment Variables

Create a **.env** file in the root directory and configure it

```sh
 cp -r .env.example
```

### 4️⃣ Run Database Migrations

```sh
pnpm db:up
```

### 5️⃣ Start the Server

```sh
pnpm dev
```

The API will be available at: **http://localhost:8000**

## 🛡️ Security

- **JWT Authentication & Session** for protected routes.
- **Role-based Access Control (RBAC)** to limit permissions.
- **Validation** for all inputs.

## 📜 License

This project is **open-source** under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Added feature XYZ'`)
4. Push to the branch (`git push origin feature-name`)
5. Submit a Pull Request 🚀

## 📞 Contact

For support or inquiries:

- **Email**: wilfriedm@cinolu.org
- **GitHub**: [your-username](https://github.com/musanzi)

---

💡 _Let's build impactful solutions for sustainable development!_ 🌍🚀
