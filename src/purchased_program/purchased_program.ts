type PurchasedProgram = {
  id: number
  programId: number
  quantity: number
  cost: number
  discountPercentage?: number
  discountAmount?: number
  finalAmount?: number
}

let createPurchasedProgram = (id: number, programId: number, quantity: number, cost: number): PurchasedProgram => {
  return {id, programId, quantity, cost}
}

export { PurchasedProgram, createPurchasedProgram }