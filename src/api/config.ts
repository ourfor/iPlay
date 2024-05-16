import { EmbySite } from "@model/EmbySite";
import { ENV, EmbyConfig, EmbyServerType } from "../helper/env";
import { Map } from "../model/Map";
import { PlaybackInfo } from "@model/PlaybackInfo";
import { PictureQuality } from "@store/configSlice";
import { Image } from "@model/Image";
import { logger } from "@helper/log";

export type { EmbyConfig } from "../helper/env"

export const DEFAULT_EMBY_CONFIG: EmbyConfig = ENV.emby

export const config = {
    emby: DEFAULT_EMBY_CONFIG,
    tmdb: {
        api_key: ENV.tmdb.api_key
    }
}

export function makeEmbyUrl(params: Map<string, any> | null, path: string, endpoint: EmbyConfig) {
    path = endpoint.type === EmbyServerType.Emby ? path : path.replace("emby/", "")
    const url = new URL(`${endpoint.protocol ?? "https"}://${endpoint.host}:${endpoint.port ?? 443}${endpoint.path}${path}`)
    params && Object.entries(params).forEach(([key, value]) => {
        if (typeof value === "string") {
            url.searchParams.append(key, value)
        } else {
            url.searchParams.append(key, String(value))
        }
    })
    return url
}

export interface ImageProps {
    maxHeight: number
    maxWidth: number
    tag: string
    quality: number
}

export function getItemImage(site: EmbySite, id: string | number, quality = PictureQuality.High) {
    const image: Image = {
        primary: imageUrl(site, id, null, "Primary"),
        backdrop: imageUrl(site, id, null, "Backdrop"),
        logo: imageUrl(site, id, null, "Logo"),
    }
    return image
}

export function imageUrl(site: EmbySite, id: string | number, options: string | Partial<ImageProps> | null, type: "Primary" | string = "Primary") {
    const endpoint = site.server!
    if (typeof options === "string") {
        return `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby/Items/${id}/Images/${type}?tag=${options}&quality=90`
    } else {
        const url = new URL(`${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby/Items/${id}/Images/${type}`)
        options && Object.entries(options).forEach(([key, value]) => {
            url.searchParams.set(key, String(value))
        })
        return url.href
    }
}

export function avatorUrl(id: string, options: string | Partial<ImageProps>, type: "Primary" = "Primary") {
    return `${config.emby.protocol}://${config.emby.host}:${config.emby.port}${config.emby.path}emby/Users/${id}/Images/${type}?height=152&tag=${options}&quality=90`
}

export function playUrl(site: EmbySite, path: string | PlaybackInfo) {
    const endpoint = site.server!
    if (typeof path === "string") {
        if (path?.startsWith("http")) return path
        return `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby${path}`
    } else {
        const sources = path?.MediaSources ?? []
        if (sources.length > 0) {
            const source = sources[0]
            if (source.Container === "strm") {
                return source.Path
            } else {
                const streamPath = source.DirectStreamUrl ?? source.Path
                if (streamPath?.startsWith("http")) return streamPath
                else {
                    return `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby${streamPath}`
                }
            }
        }
    }
}

export interface Subtitle {
    name: string
    lang: string
    url: string
}

export function subtitleUrl(site: EmbySite, path: string | PlaybackInfo) {
    const endpoint = site.server!;
    const result: Subtitle[] = [];
    if (typeof path === "string") {
        if (path?.startsWith("http")) return [{
            name: "unknown",
            lang: "unknown",
            url: path
        }]
        const part = `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby${path}`
        result.push({
            name: "unknown",
            lang: "unknown",
            url: part
        })
    } else {
        const sources = path?.MediaSources ?? []
        for (const source of sources) {
            for (const stream of source?.MediaStreams ?? []) {
                if (stream?.Type === "Subtitle" && 
                    stream?.IsExternal &&
                    stream?.DeliveryMethod === "External" &&
                    stream?.DeliveryUrl) {
                    logger.info("subtitle stream", stream)
                    const part = `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby${stream.DeliveryUrl}`
                    result.push({
                        name: stream.DisplayTitle,
                        lang: stream.Language,
                        url: part
                    })
                }
            }
        }
    }
    return result;
}