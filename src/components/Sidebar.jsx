import { useEffect, useRef, useState } from "react"
import { Divider } from "rsuite"
import CreateRoomBtnModal from "./CreateRoomBtnModal"
import DashboardToggle from "./dashboard/DashboardToggle"
import ChatRoomList from "./rooms/ChatRoomList"

const Sidebar = () => {
  const [height, setHeight] = useState(0);
  const topSideBarRef = useRef();

  useEffect(() => {
    if (topSideBarRef) setHeight(topSideBarRef.current.scrollHeight);
  }, [topSideBarRef])

  return (
    <div className="h-100 pt-2">
      <div ref={topSideBarRef}>
        <DashboardToggle />
        <CreateRoomBtnModal />
        <Divider style={{ margin: "16px 0 10px" }}>Join conversation</Divider>
      </div>
      <ChatRoomList height={height} />
    </div>
  )
}

export default Sidebar