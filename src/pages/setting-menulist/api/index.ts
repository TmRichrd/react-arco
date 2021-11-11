import request from "../../../utils/request";
export const menuPage = (current, size, params) => {
  return request({
    url: `/ums/menu/custom-page`,
    method: "get",
    params: {
      ...params,
      current,
      size
    }
  })
}

export const menuList = (params) => {
  return request({
    url: `/ums/menu/list`,
    method: "get",
    params
  })
}

export const menuAdd = (data) => {
  return request({
    url: "/ums/menu/save",
    method: "post",
    data
  })
}
export const menuRemove = (ids) => {
  return request({
    url: "/ums/menu/remove",
    method: "post",
    params: { ids }
  })
}
export const menuDetail = (id) => {
  return request({
    url: "/ums/menu/detail",
    method: "get",
    params: { id }
  })
}
export const menuUpdate = (data) => {
  return request({
    url: "/ums/menu/update",
    method: "post",
    data
  })
}