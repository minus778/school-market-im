import $http from "./request.js"
// 获取学校列表
export function getSchoolList(key,num){
	return $http.get('/api/getSchoolList',{key,num})
}