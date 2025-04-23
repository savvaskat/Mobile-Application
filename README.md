# Investify - Crypto Trading App

Investify is a React Native + Expo-powered mobile app for trading cryptocurrencies. It allows users to sign up, log in, 
view live market data, place buy/sell orders, and track their portfolio and trade history.

---

## Features

- User registration and login (with password hashing)
- View live crypto market data from CoinGecko API
- Trade cryptocurrencies (Buy/Sell)
- Auto-updating balance with each trade
- Profile page with balance, user details, and trade history
- Backend REST API with MongoDB

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local)
- Expo CLI (`npm install -g expo-cli`)
- Expo GO application (Play Store, App Store)

---

## Backend Setup

1. Navigate to `Investify-Backend/` folder:
```bash
cd Investify-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

---

## Frontend Setup

1. Go back to root and start Expo:
```bash
cd Investify
npx expo start --clear
```

scan QR code in your terminal with your camera


2. Run on emulator, device, or web.

> **Note:** Update IP in frontend API calls (`192.168.X.X`) to match your IP ADDRESS (use `ipconfig` for Windows and `ifconfig` for Linux or macOS).

---

## MongoDB Collections

### Prerequisites

- mongosh (git clone https://aur.archlinux.org/mongosh-bin.git) (cd mongosh-bin/) (makepkg -si)
- mongodb (git clone https://aur.archlinux.org/mongodb-bin.git) (cd mongodb-bin/) (makepkg -si)
- systemctl enable mongodb
- systemctl start mongodb

---

### `users`

```json
{
  "_id": "ObjectId",
  "fullname": "[FULLNAME]",
  "email": "[EMAIL]",
  "passwordHash": "...",
  "balance": 1000,
  "trades": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

### `trades`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "buy",
  "coin": "bitcoin",
  "amount": 2.5,
  "price": 30000,
  "total": 75000,
  "timestamp": "..."
}
```

---

## Testing the App

- Signup, Login
- Buy/Sell trades from Trade tab
- View balance and trades in Profile tab
- Try invalid credentials / low balance

---

## Contact

Feel free to reach out for any issues or improvements!

---

## Project Structure

```
Root/
├── Investify-Backend/     # Express + MongoDB backend
├── Investify/             # React Native app using Expo
```

---

## API Endpoints

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| POST   | /api/signup         | Register new user      |
| POST   | /api/login          | Authenticate user      |
| GET    | /api/profile/:email | Get profile + trades   |
| POST   | /api/trade          | Execute buy/sell trade |

---

## Attribution

> Powered by the [CoinGecko API](https://www.coingecko.com/en/api)

---

## License

This project is for educational and interview purposes.
