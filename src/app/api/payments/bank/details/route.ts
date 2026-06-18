import { NextResponse } from 'next/server'

export async function GET() {
  const bankDetails = {
    bankName: process.env.BANK_NAME || 'Chase Bank',
    accountName: process.env.BANK_ACCOUNT_NAME || 'Rentora Holdings Ltd',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
    branchCode: process.env.BANK_BRANCH_CODE || '010010',
    swiftCode: process.env.BANK_SWIFT_CODE || 'CHASUS33',
    currency: 'USD',
    reference: 'RNT-' + Date.now().toString(36).toUpperCase(),
  }

  return NextResponse.json(bankDetails)
}
