declare module 'midtrans-client' {
  class Snap {
    constructor()
    setConfig(options: {
      isProduction: boolean
      serverKey: string
      clientKey?: string
    }): void
    createTransaction(payload: any): Promise<any>
    createTransactionToken(payload: any): Promise<string>
  }

  class CoreApi {
    constructor()
    setConfig(options: {
      isProduction: boolean
      serverKey: string
      clientKey?: string
    }): void
    charge(payload: any): Promise<any>
    cardToken(options: any): Promise<any>
    cardPointInquiry(tokenId: string, options?: any): Promise<any>
    cardRegister(options: any): Promise<any>
    cardTokenB2B(tokenId: string, options?: any): Promise<any>
  }

  class Iris {
    constructor()
    setConfig(options: {
      isProduction: boolean
      serverKey: string
      clientKey?: string
    }): void
    createBeneficiaries(payload: any): Promise<any>
    updateBeneficiaries(beneficiaryId: string, payload: any): Promise<any>
    getBeneficiaries(): Promise<any>
    createPayouts(payload: any): Promise<any>
    getPayoutDetails(payoutId: string): Promise<any>
    approvePayout(payoutId: string, options?: any): Promise<any>
    rejectPayout(payoutId: string, options?: any): Promise<any>
  }

  export { Snap, CoreApi, Iris }
}
