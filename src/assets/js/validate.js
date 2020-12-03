import validator from 'validator'
const validateField = (key, data) => {
  // remove double whitespace and keep \n
  data.value = data.value.trim().replace(/ +/g, ' ')

  // validate required and empty data
  if (data.required && validator.isEmpty(data.value)) {
    data.invalidMsg = data.errorType.empty
    data.valid = false
    return data.valid
  }

  // validate non-empty data and check if error-format
  let pattern
  switch (key) {
    case 'phone':
      // pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
      // data.valid = pattern.test(data.value)
      data.valid = data.detail.valid
      break
    case 'email':
      data.valid = validator.isEmail(data.value, {
        allow_utf8_local_part: true
      })
      // pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\.[a-zA-Z0-9-]+)*$/
      // data.valid = pattern.test(data.value)
      break
    case 'username':
      pattern = /[!@#$%&'*+/=?^_`{|}~-]/
      data.valid = !pattern.test(data.value)
      // data.valid = !data.value.match(/[!@#$%&'*+/=?^_`{|}~-]/)
      break
    default:
      data.valid = true
      break
  }
  if (!data.valid) {
    data.invalidMsg = data.errorType.format
  } else {
    data.invalidMsg = ''
  }
  return data.valid
}

export default fields => {
  let fieldsCheckResult = []
  for (let [key, value] of Object.entries(fields)) {
    fieldsCheckResult.push(validateField(key, value))
  }

  return fieldsCheckResult.every(value => {
    return value == true
  })
}
