import request from "../../../utils/request";
export const rolesPage = (current, size, params) => {
  return request({
    url: `/ums/role/custom-page`,
    method: "get",
    params: {
      ...params,
      current,
      size
    }
  })
}

export const rolesList = () => {
  return request({
    url: `/ums/role/list`,
    method: "get",
  })
}

export const rolesAdd = (data) => {
  return request({
    url: "/ums/role/save",
    method: "post",
    data
  })
}
export const rolesRemove = (ids) => {
  return request({
    url: "/ums/role/remove",
    method: "post",
    params: { ids }
  })
}
export const rolesDetail = (id) => {
  return request({
    url: "/ums/role/detail",
    method: "get",
    params: { id }
  })
}
export const rolesUpdate = (data) => {
  return request({
    url: "/ums/role/update",
    method: "post",
    data
  })
}
export const rolesTree = (roleId:string)=>{
  return request({
    url:"/ums/role-menu/tree",
    method:"get",
    params:{roleId}
  })
}