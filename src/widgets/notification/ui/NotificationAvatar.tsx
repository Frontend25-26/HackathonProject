import { GraduationCap } from '@gravity-ui/icons';
import { Avatar } from '@gravity-ui/uikit';

import { NotificationSource } from '@/entities/notification/types';

interface NotificationAvatarProps {
    source: NotificationSource | null;
}

export const NotificationAvatar = ({ source }: NotificationAvatarProps) => {
    if (!source) return <Avatar icon={GraduationCap} size="m" />;
    if (source.imgUrl) return <Avatar imgUrl={source.imgUrl} size="m" />;
    return <Avatar text={source.userName} size="m" theme="brand" />;
};
