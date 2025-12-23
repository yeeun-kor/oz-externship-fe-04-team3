export function getDiscount(discounted_price: number, original_price: number) {
  //discounted_price 0인경우
  if (discounted_price !== 0) {
    return Math.floor(
      ((original_price - discounted_price) / original_price) * 100
    )
  }
  return null
}
