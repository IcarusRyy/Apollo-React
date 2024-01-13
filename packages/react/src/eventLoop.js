console.log('start')
async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise((resolve) => {
  console.log('Promise')
  resolve()
})
  .then(function () {
    console.log('then1')
  })
  .then(function () {
    console.log('then2')
  })
console.log('end')
// start 2end Promise end  1end then1 then2 setTimeout
