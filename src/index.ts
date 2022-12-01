import CommonUtils from './utils/common_utils';
import { Program, createProgram } from './program/program';
import { PurchasedProgram, createPurchasedProgram } from './purchased_program/purchased_program';
import { Bill } from './bill/bill';
import Coupon from './coupon/coupon';
import { isValidElement } from 'react';

let lines: string[] = CommonUtils.readFile('./input/input1.txt');
let availablePrograms: Program[] = [
  createProgram(1, 'CERTIFICATION', 3000),
  createProgram(2, 'DEGREE', 5000),
  createProgram(3, 'DIPLOMA', 2500),
];

let availableCoupons: Coupon[] = [
  {id: 1, name: 'B4G1', minProgramsCount: 4, minAmount: -1, discountPercentage: -1},
  {id: 2, name: 'DEAL_G20', minProgramsCount: -1, minAmount: 10000, discountPercentage: 20},
  {id: 3, name: 'DEAL_G5', minProgramsCount: 2, minAmount: -1, discountPercentage: 5},
]
let purchasedPrograms: PurchasedProgram[] = [];
let bill: Bill = {
  purchasedPrograms: purchasedPrograms,
  purchasedProgramsTotalAmount: 0,
  subTotal: 0,
  proMembershipFee: 0,
  enrollmentFee: 0,
  totalProDiscount: 0,
  appliedCouponIds: [],
  applicableCouponId: 0,
  couponDiscount: 0,
  total: 0
}

let checkIfApplied = (couponIds: number[], coupon: string): boolean => {
  let c = availableCoupons.find(c => c.name == coupon)
  if (c !== undefined){
    if ((couponIds.length > 0) && (couponIds.includes(c.id))) {
      return true
    }
  }
  return false
}

let applyCoupon = (coupon: string): boolean => {
  let c = availableCoupons.find(c => c.name == coupon)
  if (c != undefined){
    bill.applicableCouponId = c.id
    bill.total = CommonUtils.getAmountAfterDiscount(bill.subTotal, c.discountPercentage)
    bill.couponDiscount = bill.subTotal - bill.total
    return true
  }
  return false
}

let applyAppropriateCoupon = (totalQuantity: number, couponIds: number[]): void => {
  if(totalQuantity >= 4){
    console.log("Apply coupon B4G1")
    // applyCoupon('B4G1')
  } else if(totalQuantity >= 2 && totalQuantity < 4) {
    console.log("Apply coupon DEAL_G5")
    if(checkIfApplied(bill.appliedCouponIds, 'DEAL_G5')){
      applyCoupon('DEAL_G5')
    }
  } else if (bill.subTotal > 10000) {
    console.log("Apply coupon DEAL_G20")
    if(checkIfApplied(bill.appliedCouponIds, 'DEAL_G20')){
      applyCoupon('DEAL_G20')
    }
  }
}

lines.forEach(line => {
  if(line.trim() !== '') {
    let data: string[] = line.split(' ');
    console.log(data)
    switch(data[0]) { 
      case 'ADD_PROGRAMME': {
        let prg: Program | undefined = availablePrograms.find(prg => prg.name == data[1])
        if(prg != undefined ){
          bill.purchasedPrograms.push(
            createPurchasedProgram(
              CommonUtils.getNewId(purchasedPrograms), 
              prg.id, 
              parseInt(data[2]),
              prg.fee
            )
          )
        }
        break; 
      } 
      case 'APPLY_COUPON': {
        console.log("-".repeat(100))
        let coupon: Coupon | undefined = availableCoupons.find(c => c.name == data[1])
        console.table(coupon)
        if(coupon) {
          console.log('Specified coupon', coupon.name)
          bill.appliedCouponIds.push(coupon.id)
        }
        break;
      } 
      case 'ADD_PRO_MEMBERSHIP': {
        bill.proMembershipFee = 200
        // console.table(bill)
        break;
      } 
      case 'PRINT_BILL': {
        if(bill.proMembershipFee > 0) {
          // console.table(bill.purchasedPrograms)
          bill.purchasedPrograms.forEach(pp => {
            if (pp.quantity > 0){
              let prg: Program | undefined = availablePrograms.find(ap => ap.id == pp.id)
              let discountPercentage: number = 0;
              if(prg) {
                switch(prg.name){
                  case 'DIPLOMA': {
                    discountPercentage = 1
                    break
                  }
                  case 'DEGREE': {
                    discountPercentage = 3
                    break
                  }
                  case 'CERTIFICATION': {
                    discountPercentage = 2
                    break
                  }
                }  
              }
              pp.discountPercentage = discountPercentage
              pp.discountAmount = CommonUtils.calculateDiscountAmount(pp.quantity * pp.cost, discountPercentage)
              pp.finalAmount = CommonUtils.getAmountAfterDiscount(pp.quantity * pp.cost, discountPercentage)
              bill.totalProDiscount += pp.discountAmount
              bill.purchasedProgramsTotalAmount += pp.finalAmount
              // bill.subTotal += pp.finalAmount
            } else {
              pp.discountPercentage = 0
              pp.discountAmount = 0
              pp.finalAmount = 0
            }
          })
          //calculate the pro membership discount
        }
        if((bill.purchasedProgramsTotalAmount + bill.proMembershipFee) < 6666) {
          bill.enrollmentFee = 500
        }
        bill.subTotal = bill.purchasedProgramsTotalAmount + bill.proMembershipFee + bill.enrollmentFee
        
        console.table(bill.purchasedPrograms)
        // console.table(bill)
        const totalQuantity = bill.purchasedPrograms.reduce((accumulator, obj) => {
          return accumulator + obj.quantity;
        }, 0);
        console.table(bill)
        applyAppropriateCoupon(totalQuantity, bill.appliedCouponIds)
        console.table(bill)
        break;
      } 
      default: { 
        break; 
      } 
    } 
  }
});
