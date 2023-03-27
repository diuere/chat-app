import { Avatar } from "rsuite"
import { getNameInitials } from "../../helpers/utils"


const ProfileAvatar = ({ name, ...avatarProps }) => {
  return (
    <Avatar {...avatarProps} circle >
      {getNameInitials(name)}
    </Avatar>
  )
}

export default ProfileAvatar