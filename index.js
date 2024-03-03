// 引入所需的库和模块
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// 创建移动支付应用类
class MobilePaymentApplication {
    constructor() {
        this.users = {};
        this.transactions = [];
        this.paymentGateways = ['Alipay', 'WeChat Pay'];
        this.securityKey = this.generateSecurityKey();
    }

    // 生成安全密钥
    generateSecurityKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    // 注册用户
    registerUser(username, phoneNumber, email) {
        const userId = uuidv4();
        this.users[userId] = { username, phoneNumber, email };
        return userId;
    }

    // 进行支付
    makePayment(userId, amount, paymentMethod) {
        if (!this.users[userId]) {
            throw new Error("User not found.");
        }
        const transactionId = uuidv4();
        const transaction = { userId, amount, paymentMethod, transactionId, timestamp: new Date() };
        this.transactions.push(transaction);
        return transactionId;
    }

    // 查询账单
    inquireBill(userId) {
        if (!this.users[userId]) {
            throw new Error("User not found.");
        }
        const userTransactions = this.transactions.filter(transaction => transaction.userId === userId);
        return userTransactions;
    }
}

// 创建移动支付应用实例
const paymentApp = new MobilePaymentApplication();

// 注册用户
const userId1 = paymentApp.registerUser("Alice", "+1234567890", "alice@example.com");
const userId2 = paymentApp.registerUser("Bob", "+1987654321", "bob@example.com");

// 进行支付
const transactionId1 = paymentApp.makePayment(userId1, 100, 'Alipay');
const transactionId2 = paymentApp.makePayment(userId2, 50, 'WeChat Pay');

// 查询账单
const bill1 = paymentApp.inquireBill(userId1);
const bill2 = paymentApp.inquireBill(userId2);

// 打印账单
console.log("Bill for Alice:", bill1);
console.log("Bill for Bob:", bill2);
