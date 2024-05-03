import { logger } from "@helper/log";
import { User } from "../model/User";
import { EmbyConfig, makeEmbyUrl } from "./config";
import { EMBY_CLIENT_HEADERS } from "./view";
import { EmbyServerType } from "@helper/env";

export async function login(username: string, password: string, endpoint: EmbyConfig) {
  const params = {
    ...EMBY_CLIENT_HEADERS,
    "X-Emby-Language": "zh-cn"
  }
  const isEmby = endpoint.type === EmbyServerType.Emby
  const url = makeEmbyUrl(params, `${isEmby ? "emby/" : ""}Users/authenticatebyname`, endpoint)
  const body = isEmby ? `Username=${username}&Pw=${password}` : JSON.stringify({
    Username: username,
    Pw: password
  })
  const extraHeader = isEmby ? {} : {
    "x-emby-authorization": `MediaBrowser Client="${EMBY_CLIENT_HEADERS["X-Emby-Client"]}", Device="${EMBY_CLIENT_HEADERS["X-Emby-Device-Name"]}", DeviceId="${btoa(EMBY_CLIENT_HEADERS["X-Emby-Device-Id"])}", Version="${EMBY_CLIENT_HEADERS["X-Emby-Client-Version"]}"`
  } as any
  const contentType = isEmby ? "application/x-www-form-urlencoded; charset=UTF-8" : "application/json"
  logger.info(`login request`, url, body)
  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type":  contentType,
        ...extraHeader
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      body,
      method: "POST"
    })
    const text = await response.text()
    console.log(`login response`, text)
    console.log(`headers`, EMBY_CLIENT_HEADERS)
    const data = JSON.parse(text) as User
    if (!data?.AccessToken) {
      return Promise.reject(new Error(`username or password is incorrect`))
    }
    return data
  } catch (e) {
    console.error(`login response`, e)
    return Promise.reject(new Error(`username or password is incorrect`))
  }
}