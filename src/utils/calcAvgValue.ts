export default function calcAvgValue(nums: number[]) {
    return nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length
}
