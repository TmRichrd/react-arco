import request from "../utils/request";
interface LoginDto {
  account: string,
  password: string
}
export const loginByAccount = (data: LoginDto) => {
  return request({
    url: "/ums/login/pwdLogin",
    method: "post",
    data
  })
}
// 获取用户菜单
export const getUserMenu = (id: string) => {
  return request({
    url: "ums/user/menu-tree",
    method: "get",
    params: { id }
  })
}