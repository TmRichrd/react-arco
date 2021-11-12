import request from "../../../utils/request";
export const userPage = (current, size, params) => {
  return request({
    url: `/ums/user/custom-page`,
    method: "get",
    params: {
      ...params,
      current,
      size
    }
  })
}

export const userList = () => {
  return request({
    url: `/ums/user/list`,
    method: "get",
  })
}

export const userAdd = (data) => {
  return request({
    url: "/ums/user/save",
    method: "post",
    data
  })
}
export const userRemove = (ids) => {
  return request({
    url: "/ums/user/remove",
    method: "post",
    params: { ids }
  })
}
export const userDetail = (id) => {
  return request({
    url: "/ums/user/detail",
    method: "get",
    params: { id }
  })
}
export const userUpdate = (data) => {
  return request({
    url: "/ums/user/update",
    method: "post",
    data
  })
}