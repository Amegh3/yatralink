'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const wallet = await db.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id]);
  const txns = await db.query('SELECT * FROM wallet_transactions WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT 20', [wallet.rows[0]?.id]);
  res.json({ wallet: wallet.rows[0], transactions: txns.rows });
}));

// HE-018: Negative wallet top-up accepted
router.post('/topup', authenticate, asyncHandler(async (req, res) => {
  const { amount } = req.body;
  // INTENTIONAL: No negative check
  const wallet = await db.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id]);
  if (!wallet.rows.length) return res.status(404).json({ error: 'NotFound', message: 'Wallet not found' });
  
  const newBalance = parseFloat(wallet.rows[0].balance) + parseFloat(amount);
  await db.query('UPDATE wallets SET balance = $1 WHERE id = $2', [newBalance, wallet.rows[0].id]);
  await db.query('INSERT INTO wallet_transactions (wallet_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)',
    [wallet.rows[0].id, amount, 'CREDIT', 'Wallet top-up']);
  
  const isNeg = parseFloat(amount) < 0;
  res.json({ success: true, new_balance: newBalance, _ctf_flag: isNeg ? 'HE{travellers_018_n3g4t1v3_w4ll3t}' : undefined });
}));

module.exports = router;
