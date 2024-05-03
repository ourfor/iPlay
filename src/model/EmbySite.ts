import { EmbyConfig } from '@api/config';
import { EmbyServerType } from '@helper/env';
import { User } from '@model/User';

export interface EmbySite {
    type?: EmbyServerType;
    id: string;
    remark?: string;
    name?: string;
    version?: string;
    server: EmbyConfig;
    user: User;
    status: 'idle' | 'loading' | 'failed';
    disable?: boolean
}

export function embyUrl(site?: EmbySite|null) {
    if (!site) return null
    return `${site.server.protocol}://${site.server.host}:${site.server.port}${site.server.path}`
}