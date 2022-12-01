import { PurchasedProgram } from './../purchased_program/purchased_program';
import Coupon from './../coupon/coupon';

type Bill = {
  purchasedPrograms: PurchasedProgram[]
  purchasedProgramsTotalAmount: number
  subTotal: number
  proMembershipFee: number
  enrollmentFee: number
  totalProDiscount: number
  appliedCouponIds: number[]
  applicableCouponId: number
  couponDiscount: number
  total: number
}

export { Bill }