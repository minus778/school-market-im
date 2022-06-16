//验证手机号是否11位
export const isPhone = (str)=>{
	let re = /^1\d{10}$/
	return re.test(str)
}